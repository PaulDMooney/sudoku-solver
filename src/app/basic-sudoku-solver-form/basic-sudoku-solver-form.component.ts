import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Board } from '../sudoku-structure/board';
import { Cell } from '../sudoku-structure/cell';

@Component({
  selector: 'app-basic-solver-form',
  templateUrl: './basic-sudoku-solver-form.component.html',
  styleUrls: ['./basic-sudoku-solver-form.component.scss']
})
export class BasicSudokuSolverFormComponent implements OnInit, OnChanges {

  @Input() board: Board;

  cellInputGrid: FormControl[][];

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (!this.board) {
      return;
    }

    this.cellInputGrid = createCellInputsForGrid(this.board.grid);

  }


}

function createCellInputsForGrid(grid: Cell[][]): FormControl[][] {

  return grid.map( (column: Cell[]) => column.map((cell: Cell) => {
    return new FormControl();
  }));
}
