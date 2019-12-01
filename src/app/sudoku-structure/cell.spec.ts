import { Cell, DEFAULT_STARTING_OPTIONS, UnexpectedValue } from './cell';
import { doesNotThrow } from 'assert';
import { take } from 'rxjs/operators';

describe('Cell', () => {

  let cell: Cell;

  beforeEach(() => {
    cell = new Cell();
  });

  describe('eliminateOption', () => {
    it('should report final number when all options removed', done => {

      // Given
      const expectedResult = 1;
      const toEliminate = [2, 3, 4, 5, 6, 7, 8, 9];

      // When
      toEliminate.forEach(item => cell.eliminateOption(item));

      cell.cellStatus.subscribe(result => {

        // Then
        expect(result).toEqual({complete: true, value: expectedResult});
        done();
      });
    });

    it('should report not complete for first status', async done => {

      // Given
      const expectedResult = 1;
      const toEliminate = [2, 3, 4, 5, 6, 7, 8, 9];

      // When
      const result = await cell.cellStatus.pipe(take(1)).toPromise();

      // Then
      expect(result).toEqual({complete: false});
      done();

    });
  });

  describe('eliminateAllOptionsExcept', () => {
    it ('should report final number when explicit value set', async done => {

      // Given
      const explicitValue = 5;

      // When
      cell.eliminateAllOptionsExcept(explicitValue);

      // Then
      const result = await cell.cellStatus.pipe(take(1)).toPromise();
      expect(result).toEqual({complete: true, value: explicitValue});
      done();
    });

    it('should error when the explicit value was previously removed', () => {

      // Given
      const explicitValue = 5;
      cell.eliminateOption(explicitValue);

      // When / Then
      expect( () => cell.eliminateAllOptionsExcept(explicitValue)).toThrow(UnexpectedValue);

    });
  });
});
