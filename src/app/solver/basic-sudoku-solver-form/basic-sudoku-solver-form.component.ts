import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter, ViewChildren, QueryList } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Board } from '@app/sudoku-structure/board';
import { Cell } from '@app/sudoku-structure/cell';
import { SudokuSolverInputCellComponent } from '../sudoku-solver-input-cell/sudoku-solver-input-cell.component';

@Component({
  selector: 'app-basic-solver-form',
  templateUrl: './basic-sudoku-solver-form.component.html',
  styleUrls: ['./basic-sudoku-solver-form.component.scss']
})
export class BasicSudokuSolverFormComponent implements OnInit, OnChanges {

  @Input() board: Board;

  @Output() boardInputsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ViewChildren(SudokuSolverInputCellComponent) sudokuSolverInputs: QueryList<SudokuSolverInputCellComponent>;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (!this.board) {
      return;
    }

  }

  kick() {
    this.board.pantsKicker$.next(true);
  }

  resetBoard(event:any, rowNumber: number, columnNumber: number ) {
    this.boardInputsChanged.emit(true);
  }

  reapplyValues() {
    this.sudokuSolverInputs.forEach(input => {
      input.reApplyValue();
    });
  }

}
