import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolverComponent } from './solver.component';
import { SolverModule } from './solver.module';
import { By } from '@angular/platform-browser';
import { BasicSudokuSolverFormComponent } from './basic-sudoku-solver-form/basic-sudoku-solver-form.component';

describe('SolverComponent', () => {
  let component: SolverComponent;
  let fixture: ComponentFixture<SolverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ],
      imports: [ SolverModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a solver form with a board', () => {

    const boardComponent = fixture.debugElement.query(By.css('app-basic-solver-form'));
    expect(boardComponent).toBeTruthy();
    expect((boardComponent.componentInstance as BasicSudokuSolverFormComponent).board).toBeTruthy();
  })
});
