import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Cell, ValueEventType, CellStatus } from '../sudoku-structure/cell';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-sudoku-solver-input-cell',
  template: `X
    <ng-container *ngIf="(cell.cellStatus | async) as cellStatus" >

      <input
        *ngIf="!cellStatus.valueEvent || cellStatus.valueEvent !== valueEventType.DERIVED; else readOnlyView"
        type="text"
        [formControl]="formControl"
        value="{{cellStatus.value ? cellStatus.value : ''}}"
        [attr.data-sudoku-cell]="cellColumn + ',' + cellRow"
        [attr.data-cell-status]="cellStatus.valueEvent">
      <ng-template #readOnlyView>
        <span [attr.data-display-value]="cell.value">{{cell.value}}</span>
      </ng-template>
    </ng-container>
  `,
  styles: []
})
export class SudokuSolverInputCellComponent implements OnInit, OnChanges {

  @Input() cell: Cell;

  @Input() cellRow: number;

  @Input() cellColumn: number;

  formControl: FormControl;

  constructor() { }

  ngOnInit() {
  }

  get valueEventType() {
    return ValueEventType;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.cell) {
      this.formControl = new FormControl();
      this.formControl.valueChanges.subscribe((newValue) => {
        const numberValue = parseInt(newValue, 10);
        console.log('newValue', newValue, numberValue);
        this.cell.setValue(numberValue);
      });
    }
  }



}
