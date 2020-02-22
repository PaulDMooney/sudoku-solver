import { Cell } from './cell';
import { Observable } from 'rxjs';

export function matchCellsWithLikeOptions(allCells: Cell[]): Array<Observable<any>> {
  const unsolvedCells = allCells.filter(value => !value.currentValue);
  const allCellsByOptionsMap = mapCellsByOptions(unsolvedCells);
  const cellsWithLikeOptions = extractGroupsOfMatchingOptions(allCellsByOptionsMap.values());
  const toReturn: Observable<any>[] = [];
  cellsWithLikeOptions.forEach(likeCells => {
    const options = likeCells[0].currentOptions;
    const otherCells = unsolvedCells.filter(value => !likeCells.includes(value));
    otherCells.forEach(otherCell => {
      options.forEach(option => {
        toReturn.push(otherCell.eliminateOption(option));
      });
    });
  });
  return toReturn;
}

function mapCellsByOptions(cells: Cell[]) {
  const cellsByOptionsMap = new Map<string, Cell[]>();
  cells.forEach(cell => {

    // TODO: Redundant?
    if (cell.currentValue) {
      return;
    }
    // For this to work, options need to be ordered.
    const optionsKey = cell.currentOptions.toString();
    if (!cellsByOptionsMap.has(optionsKey)) {
      cellsByOptionsMap.set(optionsKey, []);
    }
    cellsByOptionsMap.get(optionsKey).push(cell);
  });
  return cellsByOptionsMap;
}

function extractGroupsOfMatchingOptions(cellGroups: Iterable<Cell[]>): Cell[][] {
  const toReturn = [];
  for (const cellGroup of cellGroups) {
    if (cellGroup.length === cellGroup[0].currentOptions.length) {
      toReturn.push(cellGroup);
    }
  }
  return toReturn;

}
