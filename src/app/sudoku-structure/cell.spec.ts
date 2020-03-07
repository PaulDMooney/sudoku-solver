import { Cell, DEFAULT_STARTING_OPTIONS, UnexpectedValue, CellStatus, ValueOriginType, UnsupportedOperation } from './cell';
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
        expect(result).toEqual({complete: true, value: expectedResult, valueEvent: ValueOriginType.DERIVED});
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

    it('should emit options changed event', async done => {

      // Given
      // const expectedResult = 1;
      const toEliminate = 5;

      cell.optionsChange.subscribe((options) => {

        // Then
        expect(options).not.toContain(toEliminate);
        done();
      })

      // When
      cell.eliminateOption(toEliminate)

    })
  });

  describe('setValue', () => {
    it ('should report final number when explicit value set', async done => {

      // Given
      const explicitValue = 5;

      // When
      cell.setValue(explicitValue);

      // Then
      const result: CellStatus = await cell.cellStatus.pipe(take(1)).toPromise();
      expect(result).toEqual({complete: true, value: explicitValue, valueEvent: ValueOriginType.EXPLICIT});
      done();
    });

    it('should error when the explicit value was previously removed', () => {

      // Given
      const explicitValue = 5;
      cell.eliminateOption(explicitValue);

      // When / Then
      expect( () => cell.setValue(explicitValue)).toThrow(UnexpectedValue);

    });
  });

  describe('canSetValue', () => {

    it('should return true if a value is in list of available options', () => {

      // Given
      const simpleCell = new Cell([1,2]);

      // When
      const result = simpleCell.canSetValue(1);

      // Then
      expect(result).toBe(true);
    });

    it('should return false if the value is not in the list of available options', () => {

      // Given
      const simpleCell = new Cell([1,2]);
      simpleCell.eliminateOption(1);

      // When
      const result = simpleCell.canSetValue(1);

      // Then
      expect(result).toBe(false);

    });
  });
});
