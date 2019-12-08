import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SudokuSolverInputCellComponent } from './sudoku-solver-input-cell.component';
import { Component, Input } from '@angular/core';
import { Cell, CellStatus, ValueEventType } from '../sudoku-structure/cell';
import { By } from '@angular/platform-browser';
import { take } from 'rxjs/operators';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  template: `<app-sudoku-solver-input-cell [cell]="cell"></app-sudoku-solver-input-cell>`
})
class ParentWrapper {

  @Input() cell: Cell;
}

describe('SudokuSolverInputCellComponent', () => {
  let component: ParentWrapper;
  let fixture: ComponentFixture<ParentWrapper>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [ ParentWrapper, SudokuSolverInputCellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParentWrapper);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render an input field for an incomplete cell', () => {

    // Given
    const cell = new Cell([1, 2]);

    // When
    component.cell = cell;
    fixture.detectChanges();

    // Then
    const input = fixture.debugElement.query(By.css('input'));
    expect(input).toBeTruthy();

  });

  it('should render an input field with value when cell explicitly set', () => {

    // Given
    const cell = new Cell([1, 2]);
    component.cell = cell;

    // When
    cell.setValue(2);
    fixture.detectChanges();

    // Then
    const input = fixture.debugElement.query(By.css('input'));
    expect(input).toBeTruthy();
    expect(input.nativeElement.value).toBe('2');
  });

  it('should render a span displaying a cells DERIVED value and no input field', () => {

    // Given
    const cell = new Cell([1, 2]);

    // When
    component.cell = cell;
    cell.eliminateOption(2); // derived value should be 1
    fixture.detectChanges();

    // Then
    const input = fixture.debugElement.query(By.css('input'));
    expect(input).not.toBeTruthy();
    const displaySpan = fixture.debugElement.query(By.css('span[data-display-value]'));
    expect(displaySpan).toBeTruthy();
    expect(displaySpan.nativeElement.innerHTML).toBe('1');
  });

  it('should set the value from the input field into the cell', async (done) => {

    // Given
    const cell = new Cell([1, 2]);
    component.cell = cell;
    fixture.detectChanges();

    // When
    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;
    inputEl.value = '1';
    inputEl.dispatchEvent(new Event('input'));

    // Then
    const result: CellStatus = await cell.cellStatus.pipe(take(1)).toPromise();
    expect(result).toEqual({complete: true, valueEvent: ValueEventType.EXPLICIT, value: 1});
    done();

  });

  it('should fail validation for non-numeric characters and not set value in cell', () => {

    // Given
    const cell = new Cell([1, 2]);
    const cellSpy = spyOn(cell, 'setValue');
    component.cell = cell;

    // When
    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;
    inputEl.value = 'A';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    // Then
    expect(cellSpy).toHaveBeenCalledTimes(0);
    expect(inputEl.classList).toContain('validation-error');

  });
  it('should fail validation for non-options');
  it('should fail validation for unexpected values');

});
