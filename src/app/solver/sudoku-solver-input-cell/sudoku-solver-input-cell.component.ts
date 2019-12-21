import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Cell, ValueOriginType, CellStatus } from '@app/sudoku-structure/cell';
import { FormControl, ValidationErrors } from '@angular/forms';
import { bindCallback } from 'rxjs';

@Component({
  selector: 'app-sudoku-solver-input-cell',
  template: `
    <div class="cell-container" *ngIf="(cell.cellStatus | async) as cellStatus">
      <ul class="options-list">
        <li *ngFor="let option of cell?.currentOptions" [innerHTML]="option"></li>
      </ul>

      <input
        *ngIf="!cellStatus.valueEvent || cellStatus.valueEvent !== valueEventType.DERIVED; else readOnlyView"
        type="text"
        [formControl]="formControl"
        value="{{cell.currentValue ? cell.currentValue : ''}}"
        [attr.data-sudoku-cell]="cellColumn + ',' + cellRow"
        [attr.data-cell-status]="cellStatus.valueEvent"
        [attr.data-cell-options]="cell.currentOptions"
        [class.validation-error]="formControl.invalid">
      <ng-template #readOnlyView>
        <span [attr.data-display-value]="cell.currentValue">{{cell.currentValue}}</span>
      </ng-template>
    </div>
  `,
  styleUrls: ['./sudoku-solver-input-cell.component.scss']
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
    return ValueOriginType;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.cell) {
      this.formControl = new FormControl();

      const validator = createValidator(this.cell);
      this.formControl.setValidators(validator);

      this.formControl.valueChanges.subscribe((newValue) => {
        if (this.formControl.invalid) {
          console.log('Invalid state, skipping change listener')
          return;
        }

        if (!newValue || !newValue.trim()) {
          this.cell.unsetValue();
          return;
        }

        const numberValue = parseValue(newValue);
        console.log('newValue', newValue, numberValue);
        this.cell.setValue(numberValue);
      });
    }
  }

}

function createValidator(cell: Cell) {
  return (control: FormControl): ValidationErrors => {

    if (!control.value || !control.value.trim()) {
      return null;
    }

    const valueNumber = parseValue(control.value);
    if (/*isNaN(valueNumber) || */!cell.canSetValue(valueNumber)) {
      return { invalidOption: { valid: false, value: control.value}}
    }
  }
}

function parseValue(value): number {
  return parseInt(value, 10);
}
