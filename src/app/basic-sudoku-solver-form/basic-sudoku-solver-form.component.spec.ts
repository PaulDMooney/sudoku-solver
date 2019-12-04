import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicSudokuSolverFormComponent } from './basic-sudoku-solver-form.component';
import { boardFactory, Board } from '../sudoku-structure/board';
import { By } from '@angular/platform-browser';
import { DebugElement, Component } from '@angular/core';


@Component({
  template: `<app-basic-solver-form [board]="board"></app-basic-solver-form>`
})
class ParentWrapper {

  board: Board;
}

describe('BasicSudokuSolverFormComponent', () => {
  let wrapperComponent: ParentWrapper;
  let fixture: ComponentFixture<ParentWrapper>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParentWrapper, BasicSudokuSolverFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParentWrapper);
    wrapperComponent = fixture.componentInstance;
    // fixture.detectChanges();
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
    const cellInputs: DebugElement[] = fixture.debugElement.queryAll(By.css('[data-sudoku-cell]'));
    expect(cellInputs.length).toBe(81);
  });
});
