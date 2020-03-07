import { Cell } from './cell';
import { Board, boardFactory } from './board';
import { CellContainer } from './cell-container';
import { take } from 'rxjs/operators';
import { Subject } from 'rxjs';

describe('Board', () => {

  it('should emit a boardSolved event of false to start when containers aren\'t solved yet', async (done) => {

    // Given
    const cellOptions = [1, 2, 3, 4];
    const boxCells = [new Cell(cellOptions), new Cell(cellOptions), new Cell(cellOptions), new Cell(cellOptions)];
    const rowCells = [boxCells[0], boxCells[1], new Cell(cellOptions), new Cell(cellOptions)];
    const board = new Board([new CellContainer(boxCells), new CellContainer(rowCells)], [], new Subject());

    // When
    const result = await board.boardSolved.pipe(take(1)).toPromise();

    // Then
    expect(result).toBe(false);
    done();

  });

  it('should emit a boardSolved event of true when all containers solved', async (done) => {

    // Given
    const cellOptions = [1, 2, 3, 4];
    const boxCells = [new Cell(cellOptions), new Cell(cellOptions), new Cell(cellOptions), new Cell(cellOptions)];
    const rowCells = [boxCells[0], boxCells[1], new Cell(cellOptions), new Cell(cellOptions)];
    const board = new Board([new CellContainer(boxCells), new CellContainer(rowCells)], [], new Subject());

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

  it('should emit a boardSolved event of false when a cell gets unset', async (done) => {

    // Given
    const cellOptions = [1, 2, 3, 4];
    const boxCells = [new Cell(cellOptions), new Cell(cellOptions), new Cell(cellOptions), new Cell(cellOptions)];
    const rowCells = [boxCells[0], boxCells[1], new Cell(cellOptions), new Cell(cellOptions)];
    const board = new Board([new CellContainer(boxCells), new CellContainer(rowCells)], [], new Subject());

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

  test.skip('should solve', async (done) => {

    // Given
    const board = boardFactory();
    const puzzle = [
      [5, null, null, 1],
      [null, null, 7, null, null, null, 8, 2],
      [null, 1, null, null, 2, 4, null, 3],
      [null, null, null, null, null, null, 1],
      [null, null, 9, 5, null, 8, 7],
      [null, null, 3],
      [null, 8, null, 6, 4, null, null, 1 ],
      [null, 9, 5, null, null, null, 6],
      [null, null, null, null, null, 5, null, null, 8]
  ];

    puzzle.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        if (cell) {
          board.grid[rowIndex][columnIndex].setValue(cell);
        }
      });
    });

    const result = await board.boardSolved.toPromise();
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
