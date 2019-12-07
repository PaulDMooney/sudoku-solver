import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SudokuSolverInputCellComponent } from './sudoku-solver-input-cell.component';
import { Component, Input } from '@angular/core';
import { Cell } from '../sudoku-structure/cell';
import { By } from '@angular/platform-browser';


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

    // When
    component.cell = cell;
    fixture.detectChanges();
    cell.setValue(2);

    // Then
    const input = fixture.debugElement.query(By.css('input'));
    expect(input).toBeTruthy();
    expect(input.nativeElement.value).toBe('2');
  });

  it('should render a span displaying a cells DERIVED value and no input field');

});
