import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicSudokuSolverFormComponent } from './basic-sudoku-solver-form.component';
import { boardFactory, Board } from '../sudoku-structure/board';
import { By } from '@angular/platform-browser';
import { DebugElement, Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SudokuSolverInputCellComponent } from '../sudoku-solver-input-cell/sudoku-solver-input-cell.component';


@Component({
  template: `<app-basic-solver-form [board]="board"></app-basic-solver-form>`
})
class ParentWrapper {

  @Input() board: Board;
}

describe('BasicSudokuSolverFormComponent', () => {
  let wrapperComponent: ParentWrapper;
  let fixture: ComponentFixture<ParentWrapper>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [ ParentWrapper, BasicSudokuSolverFormComponent, SudokuSolverInputCellComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParentWrapper);
    wrapperComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(wrapperComponent).toBeTruthy();
  });

  it('should create an input for each cell', () => {

    // Given
    const board = boardFactory(3);

    // When
    wrapperComponent.board = board;
    fixture.detectChanges();

    // Then
    const cellInputs: DebugElement[] = fixture.debugElement.queryAll(By.css('app-sudoku-solver-input-cell'));
    expect(cellInputs.length).toBe(81);
  });
});
