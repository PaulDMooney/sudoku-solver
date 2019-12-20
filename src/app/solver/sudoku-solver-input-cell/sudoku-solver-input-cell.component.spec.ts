import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Component, Input } from '@angular/core';
import { Cell, CellStatus, ValueOriginType } from '@app/sudoku-structure/cell';
import { By } from '@angular/platform-browser';
import { take } from 'rxjs/operators';
import { SolverModule } from '../solver.module';


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
      imports: [SolverModule],
      declarations: [ ParentWrapper ]
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
    cell.eliminatePossibility(2); // derived value should be 1
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
    expect(result).toEqual({complete: true, valueEvent: ValueOriginType.EXPLICIT, value: 1});
    done();

  });

  it('should fail validation for non-numeric characters and not set value in cell', () => {

    // Given
    const cell = new Cell([1, 2]);
    const cellSpy = spyOn(cell, 'setValue');
    component.cell = cell;
    fixture.detectChanges();

    // When
    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;
    inputEl.value = 'A';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    // Then
    expect(cellSpy).toHaveBeenCalledTimes(0);
    expect(inputEl.classList).toContain('validation-error');

  });

  it('should fail validation for non-options', () => {

    // Given
    const cell = new Cell([1, 2]);
    const cellSpy = spyOn(cell, 'setValue');
    component.cell = cell;
    fixture.detectChanges();

    // When
    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;
    inputEl.value = '3'; // Not 1 or 2 from the supplied list of options
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    // Then
    expect(cellSpy).toHaveBeenCalledTimes(0);
    expect(inputEl.classList).toContain('validation-error');
  });

  it('should fail validation for unexpected values', () => {

    // Given
    const cell = new Cell([1, 2, 3]);
    const cellSpy = spyOn(cell, 'setValue');
    component.cell = cell;
    cell.eliminatePossibility(3); // Will be an unexpected value now.
    fixture.detectChanges();

    // When
    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;
    inputEl.value = '3';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    // Then
    expect(cellSpy).toHaveBeenCalledTimes(0);
    expect(inputEl.classList).toContain('validation-error');

  });

  it('should not fail validation for blank input', () => {

    // Given
    const cell = new Cell([1, 2]);
    const cellSpy = spyOn(cell, 'setValue');
    component.cell = cell;
    fixture.detectChanges();

    // When
    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;
    inputEl.value = '';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    // Then
    expect(cellSpy).toHaveBeenCalledTimes(0);
    expect(inputEl.classList).not.toContain('validation-error');

  });

  it('should unset cell value for blank input', () => {

    // Given
    const cell = new Cell([1, 2]);
    const cellSpy = spyOn(cell, 'unsetValue');
    component.cell = cell;
    cell.setValue(1);
    fixture.detectChanges();

    // When
    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;
    inputEl.value = '';
    inputEl.dispatchEvent(new Event('input'));

    // Then
    expect(cellSpy).toHaveBeenCalledTimes(1);

  });

});
