import { Cell, ValueOriginType } from './cell';

export function deriveCellsWithUniqueOptions(allCells: Cell[]) {
  const unsolvedCells = allCells.filter(value => !value.currentValue);
  const allCellsByOptionValueMap = mapCellsByOptionValue(unsolvedCells);
  for (const entry of allCellsByOptionValueMap.entries()) {
    if (entry[1].length === 1) {
      const derivedValue = entry[0];
      const cellToComplete = entry[1][0];

      if (!cellToComplete.currentValue && !allCells.find(cell => cell.currentValue === derivedValue)) {
        console.log('unique value found', derivedValue);
        cellToComplete.setValueAndOrigin(entry[0], ValueOriginType.DERIVED);
      }
    }
  }

}

function mapCellsByOptionValue(cells: Cell[]): Map<number, Cell[]> {
  const cellsByOptionValueMap = new Map<number, Cell[]>();
  cells.forEach(cell => {
    cell.currentOptions.forEach(optionValue => {
      if (!cellsByOptionValueMap.has(optionValue)) {
        cellsByOptionValueMap.set(optionValue, []);
      }
      cellsByOptionValueMap.get(optionValue).push(cell);
    });
  });
  return cellsByOptionValueMap;
}
