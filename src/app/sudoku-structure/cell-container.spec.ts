import { Cell } from './cell';
import { CellContainer } from './cell-container';
import { take } from 'rxjs/operators';

describe('CellContainer', () => {

  it('should notify cells of changes', () => {

    // Given
    const cell1 = new Cell();
    const cell2 = new Cell();
    const spy = jest.spyOn(cell2, 'eliminateOption');
    const cellContainer = new CellContainer([cell1, cell2]);
    const setValue = 4;

    // When
    cell1.eliminateAllOptionsExcept(setValue);

    // Then
    expect(spy).toHaveBeenCalledWith(setValue);
  });

  it('should throw an error if two cells have the same value attempted', () => {

    // Given
    const cells = [new Cell(), new Cell(), new Cell(), new Cell()];
    const cellContainer = new CellContainer(cells);
    cells[0].eliminateAllOptionsExcept(4);

    // When / Then
    expect(() => cells[2].eliminateAllOptionsExcept(4)).toThrowError();
  });

  it('should emit event when all cells have final number', async (done) => {

    // Given
    const cellOptions = [1, 2, 3, 4];
    const cells = cellOptions.map(() => new Cell(cellOptions));
    const cellContainer = new CellContainer(cells);

    // When
    cells[0].eliminateAllOptionsExcept(cellOptions[0]);
    cells[1].eliminateAllOptionsExcept(cellOptions[1]);
    cells[2].eliminateAllOptionsExcept(cellOptions[2]);

    const result = await cellContainer.containerSolvedEvent.pipe(take(1)).toPromise();

    // Then
    expect(result).toBe(true);
    done();

  });

});
