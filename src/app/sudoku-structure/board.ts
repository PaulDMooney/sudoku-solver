import { CellContainer } from './cell-container';
import { ReplaySubject, Observable, Subject, forkJoin, combineLatest, BehaviorSubject } from 'rxjs';
import { Cell } from './cell';
import { Square } from './square';
import { transposeGrid } from './transpose-grid';

export class Board {

  boardSolved$: Subject<boolean> = new BehaviorSubject(false);

  /**
   *
   * @param cellContainers
   * @param grid 2D array of cells representing the grid. The first dimension is rows,
   * The second dimension is columns.
   */
  constructor(private cellContainers: CellContainer[], public grid: Cell[][], public pantsKicker$: Subject<any>) {

    combineLatest(cellContainers.map(cellContainer => cellContainer.containerSolvedEvent))
      .subscribe((statuses: boolean[]) => {

        const boardStatus = statuses.filter(status => !status).length === 0;
        this.boardSolved$.next(boardStatus);
      });
  }

  get boardSolved(): Observable<boolean> {
    return this.boardSolved$;
  }
}

export function boardFactory(squareSize: number = 3): Board {

  const dimensionLength = squareSize * squareSize;
  const options: number[] = [];
  for (let option = 1; option <= dimensionLength; option++) {
    options.push(option);
  }

  // Add all of the cells into a 2 dimensional grid
  const grid: Cell[][] = [];
  for (let i = 0; i < dimensionLength; i++) {
    grid.unshift([]);
    for (let j = 0; j < dimensionLength; j++) {
      grid[0].push(new Cell(options));
    }
  }

  const pantsKicker$ = new Subject<any>();
  const rows = createCellContainersFromRows(grid);
  const columns = createCellContainersFromColumns(grid);
  const squares = createCellContainersFromSquares(grid, squareSize, rows, columns, pantsKicker$);

  const toReturn = new Board([...rows, ...columns, ...squares], grid, pantsKicker$);
  return toReturn;
}

function createCellContainersFromRows(grid: Cell[][]): CellContainer[] {
  return grid.map((row: Cell[]) => new CellContainer(row));
}

function createCellContainersFromColumns(grid: Cell[][]): CellContainer[] {
  const transposedGrid = transposeGrid(grid);
  return createCellContainersFromRows(transposedGrid);
}

function createCellContainersFromSquares(grid: Cell[][], squareSize: number, rows:CellContainer[], columns: CellContainer[], pantsKicker$: Observable<any>): Square[] {

  const toReturn = [];

  for (let rowGroup = 0; rowGroup < squareSize; rowGroup++) {
    const overlappingRows = rows.slice(rowGroup * squareSize, rowGroup * squareSize + squareSize).map(row => [row]);
    for (let columnGroup = 0; columnGroup < squareSize; columnGroup++) {
      const cells = getSquare(grid, rowGroup, columnGroup, squareSize);
      const overlappingColumns = columns.slice(columnGroup * squareSize, columnGroup * squareSize + squareSize).map(column => [column]);
      toReturn.push(new Square(cells, overlappingRows, overlappingColumns, pantsKicker$));
    }
  }

  return toReturn;
}

function getSquare(grid: Cell[][], rowGroup: number, columnGroup: number, squareSize: number): Cell[][] {

  const squareGrid: Cell[][] = [];
  for (let squareRow = 0; squareRow < squareSize; squareRow++) {
    const row = rowGroup * squareSize + squareRow;
    squareGrid.push([]);
    for (let squareColumn = 0; squareColumn < squareSize; squareColumn++) {
      const column = columnGroup * squareSize + squareColumn;
      squareGrid[squareRow].push(grid[row][column]);
    }
  }
  return squareGrid;
}
