import { Component, OnInit, Input } from '@angular/core';
import { Cell } from '../sudoku-structure/cell';

@Component({
  selector: 'app-sudoku-solver-input-cell',
  template: `
    <input type="text" [attr.data-sudoku-cell]="cellColumn + ',' + cellRow">
  `,
  styles: []
})
export class SudokuSolverInputCellComponent implements OnInit {

  @Input() cell: Cell;

  @Input() cellRow: number;

  @Input() cellColumn: number;

  constructor() { }

  ngOnInit() {
  }

}
