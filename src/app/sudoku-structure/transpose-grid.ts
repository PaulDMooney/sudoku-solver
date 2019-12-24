
export function transposeGrid(grid: any[][]): any[][] {
  return grid[0].map((_, columnIndex) => grid.map(row => row[columnIndex]));
}
