import { Cell, CellStatus, ValueOriginType } from './cell';
import { Subject, ReplaySubject, forkJoin, Observable, combineLatest, BehaviorSubject } from 'rxjs';

export class CellContainer {

  private containerSolved$: Subject<boolean> = new BehaviorSubject(false);

  constructor(private cells: Cell[]) {

    cells.forEach(cell => {
      subscribeToValueSetEvent(cell, cells);
      subscribeToOptionsChangeEvent(cell, cells);
    });

    // Emit Event when all cells are complete.
    combineLatest(cells.map(cell => cell.cellStatus)).subscribe((values: CellStatus[]) => {

      if (values.filter((status: CellStatus) => !status.complete).length === 0) {

        console.log('Container solved');
        this.containerSolved$.next(true);
      } else {
        this.containerSolved$.next(false);
      }
    });
  }

  public get containerSolvedEvent(): Observable<boolean> {
    return this.containerSolved$;
  }

}

function subscribeToValueSetEvent(cell: Cell, allCells: Cell[]) {
  const otherCells = allCells.filter(value => value !== cell);
  cell.cellStatus.subscribe(status => changeOtherCellOptions(status, otherCells));
}

function changeOtherCellOptions(status: CellStatus, otherCells: Cell[]) {
  if (status.complete) {
    // console.log('Notifying cells of final value set', status);
    otherCells.forEach(otherCell => {
      otherCell.eliminatePossibility(status.value);
    });
  } else {
    if (status.valueEvent === ValueOriginType.UNSET) {
      // console.log('Notifying cells of re-added option', status);
      otherCells.forEach(otherCell => {
        otherCell.addPossibility(status.value);
      });
    }
  }
}

function subscribeToOptionsChangeEvent(cell: Cell, allCells: Cell[]) {

  cell.possibilitiesChange.subscribe(() => {
    const allCellsByOptionsMap = mapCellsByOptions(allCells);
    const cellsWithLikeOptions = extractGroupsOfMatchingOptions(allCellsByOptionsMap.values());
    cellsWithLikeOptions.forEach(likeCells => {
      const options = likeCells[0].currentPossibilities;
      const otherCells = allCells.filter(value => !likeCells.includes(value));
      otherCells.forEach(otherCell => {
        options.forEach(option => {
          otherCell.eliminatePossibility(option);
        });
      });
    });
  });

}

function mapCellsByOptions(cells: Cell[]) {
  const cellsByOptionsMap = new Map<string, Cell[]>();
  cells.forEach(cell => {

    // For this to work, options need to be ordered.
    const optionsKey = cell.currentPossibilities.toString();
    if (!cellsByOptionsMap.has(optionsKey)) {
      cellsByOptionsMap.set(optionsKey, []);
    }
    cellsByOptionsMap.get(optionsKey).push(cell);
  });
  return cellsByOptionsMap;
}

function extractGroupsOfMatchingOptions(cellGroups:Iterable<Cell[]>): Cell[][] {
  const toReturn = [];
  for (const cellGroup of cellGroups) {
    if (cellGroup.length === cellGroup[0].currentPossibilities.length) {
      toReturn.push(cellGroup);
    }
  }
  return toReturn;

}
