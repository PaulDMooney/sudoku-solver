import { Cell } from './cell';
import { Board, boardFactory } from './board';
import { CellContainer } from './cell-container';
import { take } from 'rxjs/operators';

describe('Board', () => {

  it('should emit event when all containers solved', async (done) => {

    // Given
    const cellOptions = [1, 2, 3, 4];
    const boxCells = [new Cell(cellOptions), new Cell(cellOptions), new Cell(cellOptions), new Cell(cellOptions)];
    const rowCells = [boxCells[0], boxCells[1], new Cell(cellOptions), new Cell(cellOptions)];
    const board = new Board([new CellContainer(boxCells), new CellContainer(rowCells)], []);

    // Expecting overlapping cell boxCell[0] to be set automatically, expecting final cell rowCells[3] to be set automatically
    boxCells[2].setValue(1);
    boxCells[3].setValue(2);
    boxCells[1].setValue(3); // Overlapping cell
    rowCells[2].setValue(1);

    // When
    const result = await board.boardSolved.pipe(take(1)).toPromise();

    // Then
    expect(result).toBe(true);
    done();

  });
});

describe('BoardFactory', () => {
  it ('should create a board with a 9 by 9 array of cells', () => {

    // When
    const board = boardFactory();

    // Then
    expect(board.grid.length).toBe(9);
    board.grid.forEach((cells: Cell[]) => {
      expect(cells.length).toBe(9);
    });
  });

  it('should create a board with a grid of all unique cells', () => {

    // When
    const board = boardFactory();
    const visitedCells: Cell[] = [];

    // Then
    [].concat(...board.grid).forEach(cell => {
      expect(visitedCells).not.toContain(cell);
      visitedCells.push(cell);
    });
  });

  // it('should create a board with a cell-container for each row in the grid', () => {

  //   // When
  //   const board = boardFactory();

  //   // Then
  //   // ??? How do I test for this when we don't keep the structure... yet??
  // });
});
