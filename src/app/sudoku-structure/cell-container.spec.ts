import { Cell } from './cell';
import { CellContainer } from './cell-container';

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

});
