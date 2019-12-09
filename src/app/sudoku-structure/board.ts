import { CellContainer } from './cell-container';
import { ReplaySubject, Observable, Subject, forkJoin, combineLatest, BehaviorSubject } from 'rxjs';
import { Cell } from './cell';

export class Board {

  boardSolved$: Subject<boolean> = new BehaviorSubject(false);

  constructor(private cellContainers: CellContainer[], public grid: Cell[][]) {

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

  const rows = createCellContainersFromRows(grid);
  const columns = createCellContainersFromColumns(grid);
  const squares = createCellContainersFromSquares(grid, squareSize);

  const toReturn = new Board([...rows, ...columns, ...squares], grid);
  return toReturn;
}

function createCellContainersFromColumns(grid: Cell[][]): CellContainer[] {
  return grid.map((column: Cell[]) => new CellContainer(column));
}

function createCellContainersFromRows(grid: Cell[][]): CellContainer[] {
  const toReturn = [];
  for (let i = 0; i < grid.length; i++) {
    const row = [];
    for (let j = 0; j < grid[i].length; j++) {
      row.push(grid[j][i]);
    }
    toReturn.push(new CellContainer(row));
  }
  return toReturn;
}

function createCellContainersFromSquares(grid: Cell[][], squareSize: number): CellContainer[] {

  const toReturn = [];

  for (let xSquares = 0; xSquares < squareSize; xSquares++) {
    for (let ySquares = 0; ySquares < squareSize; ySquares++) {
      const cells = getSquare(grid, xSquares, ySquares, squareSize);
    }
  }

  return toReturn;
}

function getSquare(grid: Cell[][], xSquare: number, ySquare: number, squareSize: number) {

  const cells = [];
  for (let i = xSquare * squareSize; i < xSquare * squareSize + squareSize; i++) {
    for (let j = xSquare * squareSize; j < xSquare * squareSize + squareSize; j++) {
      cells.push(grid[i][j]);
    }
  }
  return cells;
}
