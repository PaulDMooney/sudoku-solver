import { CellContainer } from './cell-container';
import { Cell } from './cell';
import { findRowsWithUniqueValues, findColumnsWithUniqueValues, IndexValuePair } from './derive-squares-cells';

interface OverlappingContainer {
  cellContainer: CellContainer;

}

export class Square extends CellContainer {

  /**
   *
   * @param grid a 2D array of cells with the same layout they have in the larger Board's grid.
   * @param overlappingRows first dimension matches the row number of the cells in the grid.
   * Second dimension is how many rows there are (usually this is 1 but in a super sudoku this could be 2)
   * @param overLappingColumns
   */
  constructor(private grid: Cell[][], private overlappingRows: CellContainer[][], private overLappingColumns: CellContainer[][]) {

    super(flattenGrid(grid));

    // this.cells.forEach(cell => this.subscribeToOptionsChange(cell));
  }

  private subscribeToOptionsChange(cell: Cell) {
    cell.optionsChange.subscribe(() => {
      const uniqueRowValues = findRowsWithUniqueValues(this.grid);
      uniqueRowValues.forEach(this.notifyVectorsFunction(this.overlappingRows));

      const uniqueColumnValues = findColumnsWithUniqueValues(this.grid);
      uniqueColumnValues.forEach(this.notifyVectorsFunction(this.overLappingColumns));
    });

  }

  notifyVectorsFunction = (overlappingVectors: CellContainer[][]) => {
    return pair => {
      const vectorGroup = overlappingVectors[pair.index];
      vectorGroup.forEach(vector => {
        vector.cells.forEach(cell => {
          if (!cell.currentValue && !this.cells.includes(cell)) {
            cell.eliminateOption(pair.value);
          }
        });
      });
    };
  }

}

function flattenGrid(grid: Cell[][]): Cell[] {
  return grid.reduce( (accum, row) => {
    return accum.concat(row);
  }, []);
}
