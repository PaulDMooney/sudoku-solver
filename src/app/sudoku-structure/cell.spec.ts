import { Cell, DEFAULT_STARTING_OPTIONS, UnexpectedValue, CellStatus, ValueEventType } from './cell';
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
        expect(result).toEqual({complete: true, value: expectedResult, valueEvent: ValueEventType.DERIVED});
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

  describe('setValue', () => {
    it ('should report final number when explicit value set', async done => {

      // Given
      const explicitValue = 5;

      // When
      cell.setValue(explicitValue);

      // Then
      const result: CellStatus = await cell.cellStatus.pipe(take(1)).toPromise();
      expect(result).toEqual({complete: true, value: explicitValue, valueEvent: ValueEventType.EXPLICIT});
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

  describe('unsetValue', () => {
    it('should report not complete and previous value', async (done) => {

      // Given
      const explicitValue = 5;
      cell.setValue(5);

      // When
      cell.unsetValue();

      const result = await cell.cellStatus.pipe(take(1)).toPromise();

      expect(result).toEqual({complete: false, value: explicitValue, valueEvent: ValueEventType.UNSET});
      done();

    });

    it('should remain incomplete if called when no value had been set previously', async (done) => {

      // When
      cell.unsetValue();

      const result = await cell.cellStatus.pipe(take(1)).toPromise();

      expect(result).toEqual({complete: false});
      done();
    });
  });

  describe('addOption', () => {

    it('should throw an error if that option is the cells value', () => {

      // Given
      const explicitValue = 5;
      cell.setValue(5);

      // When / Then
      expect(() => cell.addOption(explicitValue)).toThrow(UnexpectedValue);
    });
  });

  it('should cause cells with DERIVED values to report not complete and previous value', async (done) => {

    // Given
    const simpleCell = new Cell([1, 2]);
    simpleCell.eliminateOption(2);

    // When
    simpleCell.addOption(2);

    // Then
    const result = await simpleCell.cellStatus.pipe(take(1)).toPromise();

    expect(result).toEqual({complete: false, value: 2, valueEvent: ValueEventType.UNSET});
    done();
  });

  it('should not cause a change in event for cells with EXPLICIT values', async (done) => {

    // Given
    const simpleCell = new Cell([1, 2]);
    simpleCell.setValue(2);

    // When
    simpleCell.addOption(2);

    // Then
    const result = await simpleCell.cellStatus.pipe(take(1)).toPromise();

    expect(result).toEqual({complete: true, value: 2, valueEvent: ValueEventType.EXPLICIT});
    done();
  });
});
