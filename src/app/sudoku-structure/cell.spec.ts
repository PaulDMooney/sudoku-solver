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

      cell.value.subscribe(result => {

        // Then
        expect(result).toBe(expectedResult);
        done();
      });

      // When
      toEliminate.forEach(item => cell.eliminateOption(item));
    });

    it('should report final number when all options removed to new subscribers', done => {

      // Given
      const expectedResult = 1;
      const toEliminate = [2, 3, 4, 5, 6, 7, 8, 9];

      // When
      toEliminate.forEach(item => cell.eliminateOption(item));

      cell.value.subscribe(result => {

        // Then
        expect(result).toBe(expectedResult);
        done();
      });
    });
  });

  describe('eliminateAllOptionsExcept', () => {
    it ('should report final number when explicit value set', async done => {

      // Given
      const explicitValue = 5;

      // When
      cell.eliminateAllOptionsExcept(explicitValue);

      // Then
      const result = await cell.value.pipe(take(1)).toPromise();
      expect(result).toBe(explicitValue);
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
