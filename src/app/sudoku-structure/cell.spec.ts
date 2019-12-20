import { Cell, DEFAULT_STARTING_OPTIONS, UnexpectedValue, CellStatus, ValueOriginType, UnsupportedOperation } from './cell';
import { doesNotThrow } from 'assert';
import { take } from 'rxjs/operators';
import { EEXIST } from 'constants';

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
      toEliminate.forEach(item => cell.eliminatePossibility(item));

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

      cell.possibilitiesChange.subscribe((options) => {

        // Then
        expect(options).not.toContain(toEliminate);
        done();
      })

      // When
      cell.eliminatePossibility(toEliminate)

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
      cell.eliminatePossibility(explicitValue);

      // When / Then
      expect( () => cell.setValue(explicitValue)).toThrow(UnexpectedValue);

    });
  });

  describe('unsetValue', () => {
    it('should report not complete and previous value', async (done) => {

      // Given
      const explicitValue = 5;
      cell.setValue(5);

      // When
      cell.unsetValue();

      const result = await cell.cellStatus.pipe(take(1)).toPromise();

      expect(result).toEqual({complete: false, value: explicitValue, valueEvent: ValueOriginType.UNSET});
      done();

    });

    it('should remain incomplete if called when no value had been set previously', async (done) => {

      // When
      cell.unsetValue();

      const result = await cell.cellStatus.pipe(take(1)).toPromise();

      expect(result).toEqual({complete: false});
      done();
    });

    it('should throw an error when attempted to be called on a cell with a DERIVED value', () => {

      // Given
      const cellOptions = [1,2];
      const simpleCell = new Cell(cellOptions);
      simpleCell.eliminatePossibility(2); // At this point the cell will have a DERIVED value of 1.

      // When / Then
      expect(() => simpleCell.unsetValue()).toThrow(UnsupportedOperation);
    });
  });

  describe('addOption', () => {

    it('should throw an error if that option is the cells value', () => {

      // Given
      const explicitValue = 5;
      cell.setValue(5);

      // When / Then
      expect(() => cell.addPossibility(explicitValue)).toThrow(UnexpectedValue);
    });
  });

  it('should cause cells with DERIVED values to report not complete and previous value', async (done) => {

    // Given
    const simpleCell = new Cell([1, 2]);
    simpleCell.eliminatePossibility(2); // Will have derived value of 1

    // When
    simpleCell.addPossibility(2);

    // Then
    const result = await simpleCell.cellStatus.pipe(take(1)).toPromise();

    expect(result).toEqual({complete: false, value: 1, valueEvent: ValueOriginType.UNSET});
    done();
  });

  it('should not cause a change in event for cells with EXPLICIT values', async (done) => {

    // Given
    const simpleCell = new Cell([1, 2]);
    simpleCell.setValue(2);

    // When
    simpleCell.addPossibility(1);

    // Then
    const result = await simpleCell.cellStatus.pipe(take(1)).toPromise();

    expect(result).toEqual({complete: true, value: 2, valueEvent: ValueOriginType.EXPLICIT});
    done();
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
      simpleCell.eliminatePossibility(1);

      // When
      const result = simpleCell.canSetValue(1);

      // Then
      expect(result).toBe(false);

    });
  });
});
