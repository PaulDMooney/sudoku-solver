import { Cell } from './cell';
import { transposeGrid } from './transpose-grid';

export interface IndexValuePair {
  index: number;
  value: number;
}

type Index = number;
type OptionValue = number;

export function findRowsWithUniqueValues(grid: Cell[][]): IndexValuePair[] {

  const rowIndexesByOptionValues = mapRowIndexesByOptionValues(grid);
  return Array.from(rowIndexesByOptionValues.entries())
    .filter(entry => entry[1].length === 1) // The option value can only belong under 1 index to qualify
    .map(entry => ({
      index: entry[1][0],
      value: entry[0]
    }));
}

export function findColumnsWithUniqueValues(grid: Cell[][]): IndexValuePair[] {
  const transposedGrid = transposeGrid(grid);
  return findRowsWithUniqueValues(transposedGrid);
}

function mapRowIndexesByOptionValues(grid: Cell[][]): Map<OptionValue, Index[]> {

  const toReturn = new Map<OptionValue, Index[]>();
  grid.forEach((row: Cell[], rowIndex) => {
    const uniqueOptionValues = uniqueOptionsAcrossUnsolvedCells(row);
    uniqueOptionValues.forEach(optionValue => {
      if (!toReturn.has(optionValue)) {
        toReturn.set(optionValue, []);
      }
      toReturn.get(optionValue).push(rowIndex);
    });
  });

  return toReturn;
}

function uniqueOptionsAcrossUnsolvedCells(cells: Cell[]): number[] {

  const options = cells.reduce(
    (setOfOptions: Set<OptionValue>, cell: Cell) => {
      if (!cell.currentValue) {
        cell.currentOptions.forEach(value => setOfOptions.add(value));
      }
      return setOfOptions;
    },
    new Set<number>([])
  );

  return Array.from(options);
}


