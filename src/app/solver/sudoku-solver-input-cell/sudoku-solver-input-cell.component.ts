import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Cell, ValueOriginType, CellStatus } from '@app/sudoku-structure/cell';
import { FormControl, ValidationErrors, Form } from '@angular/forms';


export interface RowColumnPair {
  row: number;
  column: number;
}
@Component({
  selector: 'app-sudoku-solver-input-cell',
  template: `
    <div class="cell-container" *ngIf="(cell.cellStatus | async) as cellStatus">

      <input
        *ngIf="!cellStatus.valueEvent || cellStatus.valueEvent !== valueEventType.DERIVED; else readOnlyView"
        type="text"
        [formControl]="formControl"
        [attr.data-sudoku-cell]="cellColumn + ',' + cellRow"
        [attr.data-cell-status]="cellStatus.valueEvent"
        [attr.data-cell-options]="cell.currentOptions"
        [class.validation-error]="formControl.invalid">
      <ng-template #readOnlyView>
        <span [attr.data-display-value]="cell.currentValue">{{cell.currentValue}}</span>
      </ng-template>

      <ul class="options-list">
        <li *ngFor="let option of cell?.currentOptions" [innerHTML]="option"></li>
      </ul>
    </div>
  `,
  styleUrls: ['./sudoku-solver-input-cell.component.scss']
})
export class SudokuSolverInputCellComponent implements OnInit, OnChanges {

  @Input() cell: Cell;

  @Input() cellRow: number;

  @Input() cellColumn: number;

  @Output() valueChanged: EventEmitter<RowColumnPair> = new EventEmitter<RowColumnPair>();

  formControl: FormControl = new FormControl();

  constructor() { }

  ngOnInit() {
  }

  get valueEventType() {
    return ValueOriginType;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.cell) {
      return;
    }


    const validator = createValidator(this.cell);
    this.formControl.setValidators(validator);
    this.formControl.setValue(this.cell.currentValue);

    if (this.formControl.dirty && this.formControl.valid) {
      this.cell.setValue(parseValue(this.formControl.value));
    }

    this.formControl.valueChanges.subscribe((newValue) => {
      if (this.formControl.invalid) {
        console.log('Invalid state, skipping change listener');
        return;
      }

      if (this.cell.currentValue) {
        this.valueChanged.emit({
          row: this.cellRow,
          column: this.cellColumn
        });
        return;
      }

      if (!newValue || !newValue.trim()) {
        return;
      }

      const numberValue = parseValue(newValue);
      console.log('newValue', newValue, numberValue);
      this.cell.setValue(numberValue).subscribe(() => console.log('done setting value'));
    });

  }

  public reApplyValue() {
    if (this.formControl.dirty && this.formControl.valid && !isBlankValue(this.formControl)) {
      this.cell.setValue(parseValue(this.formControl.value));
    }
  }

}

function createValidator(cell: Cell) {
  return (control: FormControl): ValidationErrors => {

    if (isBlankValue(control)) {
      return null;
    }

    const valueNumber = parseValue(control.value);
    if (/*isNaN(valueNumber) || */!cell.canSetValue(valueNumber)) {
      return { invalidOption: { valid: false, value: control.value}}
    }
  }
}

function isBlankValue(control: FormControl) {
  return !control.value || !control.value.trim();
}

function parseValue(value): number {
  return parseInt(value, 10);
}
