import { Cell } from './cell';
import { CellContainer } from './cell-container';
import { take } from 'rxjs/operators';

describe('CellContainer', () => {

  it('should notify cells of options eliminated from the container', () => {

    // Given
    const cell1 = new Cell();
    const cell2 = new Cell();
    const cell2Spy = jest.spyOn(cell2, 'eliminateOption');
    const cellContainer = new CellContainer([cell1, cell2]);
    const setValue = 4;

    // When
    cell1.setValue(setValue);

    // Then
    expect(cell2Spy).toHaveBeenCalledWith(setValue);
  });

  it('should throw an error if two cells have the same value attempted', () => {

    // Given
    const cells = [new Cell(), new Cell(), new Cell(), new Cell()];
    const cellContainer = new CellContainer(cells);
    cells[0].setValue(4);

    // When / Then
    expect(() => cells[2].setValue(4)).toThrowError();
  });

  it('should emit event with true value when all cells have final number', async (done) => {

    // Given
    const cellOptions = [1, 2, 3, 4];
    const cells = cellOptions.map(() => new Cell(cellOptions));
    const cellContainer = new CellContainer(cells);

    // When
    cells[0].setValue(cellOptions[0]);
    cells[1].setValue(cellOptions[1]);
    cells[2].setValue(cellOptions[2]);

    const result = await cellContainer.containerSolvedEvent.pipe(take(1)).toPromise();

    // Then
    expect(result).toBe(true);
    done();

  });

  it('should notify cells of options made available to the container again', () => {

    // Given
    const cell1 = new Cell();
    const cell2 = new Cell();
    const cell2Spy = jest.spyOn(cell2, 'addOption');
    const cellContainer = new CellContainer([cell1, cell2]);
    const setValue = 4;
    cell1.setValue(setValue);

    // When
    cell1.unsetValue();

    // Then
    expect(cell2Spy).toHaveBeenCalledWith(setValue);
  });

});
