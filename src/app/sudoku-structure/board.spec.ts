import { Cell } from './cell';
import { Board } from './board';
import { CellContainer } from './cell-container';
import { take } from 'rxjs/operators';

describe('Board', () => {

  it('should emit event when all containers solved', async (done) => {


    // Given
    const cellOptions = [1, 2, 3, 4];
    const boxCells = [new Cell(cellOptions), new Cell(cellOptions), new Cell(cellOptions), new Cell(cellOptions)];
    const rowCells = [boxCells[0], boxCells[1], new Cell(cellOptions), new Cell(cellOptions)];
    const board = new Board([new CellContainer(boxCells), new CellContainer(rowCells)]);

    // Expecting overlapping cell boxCell[0] to be set automatically, expecting final cell rowCells[3] to be set automatically
    boxCells[2].eliminateAllOptionsExcept(1);
    boxCells[3].eliminateAllOptionsExcept(2);
    boxCells[1].eliminateAllOptionsExcept(3); // Overlapping cell
    rowCells[2].eliminateAllOptionsExcept(1);

    // When
    const result = await board.boardSolved.pipe(take(1)).toPromise();

    // Then
    expect(result).toBe(true);
    done();

  });
});
