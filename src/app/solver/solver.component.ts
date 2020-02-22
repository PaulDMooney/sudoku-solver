import { Component, OnInit, ViewChild } from '@angular/core';
import { Board, boardFactory } from '@app/sudoku-structure/board';
import { BasicSudokuSolverFormComponent } from './basic-sudoku-solver-form/basic-sudoku-solver-form.component';

@Component({
  templateUrl: './solver.component.html',
  styleUrls: ['./solver.component.scss']
})
export class SolverComponent implements OnInit {

  board: Board;

  @ViewChild(BasicSudokuSolverFormComponent, {static:false}) basicSolverForm: BasicSudokuSolverFormComponent;

  constructor() {
    this.board = boardFactory(3);
  }

  ngOnInit() {

  }

  resetBoard() {
    this.board.reset();
    this.basicSolverForm.reapplyValues();
  }

}
