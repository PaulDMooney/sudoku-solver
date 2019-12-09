import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { boardFactory, Board } from '@app/sudoku-structure/board';
import { By } from '@angular/platform-browser';
import { DebugElement, Component, Input } from '@angular/core';
import { SolverModule } from '../solver.module';


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
      imports: [SolverModule],
      declarations: [ ParentWrapper],
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
