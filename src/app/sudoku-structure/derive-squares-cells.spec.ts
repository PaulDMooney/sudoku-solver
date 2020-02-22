import { Cell } from './cell'
import { findRowsWithUniqueValues, findColumnsWithUniqueValues } from './derive-squares-cells';

describe('derive-squares-cells', () => {

  describe('findRowsWithUniqueValues', () => {
    it('should find a row with a unique option value', () => {

      // Given a grid with only 2nd row containing the option 3
      const grid = [
        [new Cell([5]), new Cell([2]), new Cell([4, 6, 8])],
        [new Cell([3, 4, 6, 9]), new Cell([3, 4, 6]), new Cell([7])],
        [new Cell([6, 8, 9]), new Cell([1]), new Cell([6, 8])]
      ];

      // Ensure the cells we set with one option solved so they are not in the results.
      grid[0][0].setValue(5);
      grid[0][1].setValue(2);
      grid[1][2].setValue(7);
      grid[2][1].setValue(1);

      // When
      const result = findRowsWithUniqueValues(grid);

      // Then
      expect(result.length).toBe(1);
      expect(result[0]).toEqual({index: 1, value: 3});
    });
  });

  describe('findColumnsWithUniqueValues', () => {

    it('should find a column with a unique option value', () => {
      // Given a grid with only 2nd row containing the option 3
      const grid = [
        [new Cell([5]), new Cell([3, 4, 6, 9]), new Cell([6, 8, 9])],
        [new Cell([2]), new Cell([3, 4, 6]), new Cell([1])],
        [new Cell([4, 6, 8]), new Cell([7]), new Cell([6, 8])]
      ];

      // Ensure the cells we set with one option solved so they are not in the results.
      grid[0][0].setValue(5);
      grid[1][0].setValue(2);
      grid[2][1].setValue(7);
      grid[1][2].setValue(1);

      // When
      const result = findColumnsWithUniqueValues(grid);

      // Then
      expect(result.length).toBe(1);
      expect(result[0]).toEqual({index: 1, value: 3});
    });
  });
});
