import { CellContainer } from './cell-container';
import { Cell } from './cell';

interface OverlappingContainer {
  cellContainer: CellContainer;

}

export class Square extends CellContainer {

  /**
   *
   * @param grid
   * @param overlappingRows first dimension matches the row number of the cells in the grid.
   * Second dimension is how many rows there are (usually this is 1 but in a super sudoku this could be 2)
   * @param overLappingColumns
   */
  constructor(grid: Cell[][], overlappingRows: CellContainer[][], overLappingColumns: CellContainer[][]) {

    const allCells = flattenGrid(grid);
    super(allCells);
  }

}

function flattenGrid(grid: Cell[][]): Cell[] {
  return grid.reduce( (accum, row) => {
    return accum.concat(row);
  }, []);
}
