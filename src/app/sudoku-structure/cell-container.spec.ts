import { Cell } from './cell';
import { CellContainer } from './cell-container';
import { take } from 'rxjs/operators';

describe('CellContainer', () => {

  it('should emit a container solved event of false to start', async (done) => {

    // Given
    const cellOptions = [1, 2, 3, 4];
    const cells = cellOptions.map(() => new Cell(cellOptions));
    const cellContainer = new CellContainer(cells);

    // When
    const result = await cellContainer.containerSolvedEvent.pipe(take(1)).toPromise();

    // Then
    expect(result).toBe(false);
    done();
  });

  it('should emit container solved event with true value when all cells have final number', async (done) => {

    // Given
    const cellOptions = [1, 2, 3, 4];
    const cells = cellOptions.map(() => new Cell(cellOptions));
    const cellContainer = new CellContainer(cells);

    // When
    cells[0].setValue(cellOptions[0]);
    cells[1].setValue(cellOptions[1]);
    cells[2].setValue(cellOptions[2]); // cell[3] should have derived it's final number by now

    const result = await cellContainer.containerSolvedEvent.pipe(take(1)).toPromise();

    // Then
    expect(result).toBe(true);
    done();

  });

  it('should emit container solved event of false when a cell is unset', async (done) => {

    // Given
    const cellOptions = [1, 2, 3, 4];
    const cells = cellOptions.map(() => new Cell(cellOptions));
    const cellContainer = new CellContainer(cells);
    cells[0].setValue(cellOptions[0]);
    cells[1].setValue(cellOptions[1]);
    cells[2].setValue(cellOptions[2]); // At this point the container is solved.

    // When
    cells[0].unsetValue();

    const result = await cellContainer.containerSolvedEvent.pipe(take(1)).toPromise();

    // Then
    expect(result).toBe(false);
    done();
  });

  it('should throw an error if two cells have the same value attempted', () => {

    // Given
    const cells = [new Cell(), new Cell(), new Cell(), new Cell()];
    const cellContainer = new CellContainer(cells);
    cells[0].setValue(4);

    // When / Then
    expect(() => cells[2].setValue(4)).toThrowError();
  });

  it('should notify other cells of options eliminated from the container', () => {

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

  it('should not notify originating cell of option eliminated from the container', () => {

    // Given
    const cell1 = new Cell();
    const cell2 = new Cell();
    const cell1Spy = jest.spyOn(cell1, 'eliminateOption');
    const cellContainer = new CellContainer([cell1, cell2]);
    const setValue = 4;

    // When
    cell1.setValue(setValue);

    // Then
    expect(cell1Spy).not.toHaveBeenCalledWith(setValue);
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

  it('should find cells with matching options and eliminate those options from other cells', () => {

    // Given
    const options = [1,2,3,4];
    const cell1 = new Cell(options);
    const cell2 = new Cell(options);
    const cell3 = new Cell(options);
    const cell4 = new Cell(options);
    const cellContainer = new CellContainer([cell1, cell2, cell3, cell4]);

    cell1.eliminateOption(3);
    cell1.eliminateOption(4);
    cell2.eliminateOption(3);

    // When : Eliminating 4th option makes cell1 and cell2 have an option list of [1,2]. Triggers change.
    cell2.eliminateOption(4);

    // Then
    expect(cell3.currentOptions).toEqual([3,4]);
    expect(cell4.currentOptions).toEqual([3,4]);


  });

});
