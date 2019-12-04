import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Board } from '../sudoku-structure/board';

@Component({
  selector: 'app-basic-solver-form',
  templateUrl: './basic-sudoku-solver-form.component.html',
  styleUrls: ['./basic-sudoku-solver-form.component.scss']
})
export class BasicSudokuSolverFormComponent implements OnInit, OnChanges {

  @Input() board: Board;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    throw new Error("Method not implemented.");
  }


}
