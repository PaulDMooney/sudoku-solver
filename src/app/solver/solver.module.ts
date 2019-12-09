import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SolverRoutingModule } from './solver-routing.module';
import { BasicSudokuSolverFormComponent } from './basic-sudoku-solver-form/basic-sudoku-solver-form.component';
import { SudokuSolverInputCellComponent } from './sudoku-solver-input-cell/sudoku-solver-input-cell.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SolverComponent } from './solver.component';


@NgModule({
  declarations: [BasicSudokuSolverFormComponent, SudokuSolverInputCellComponent, SolverComponent],
  imports: [
    CommonModule,
    SolverRoutingModule,
    ReactiveFormsModule
  ],
  exports: [BasicSudokuSolverFormComponent, SudokuSolverInputCellComponent],
  entryComponents: [SolverComponent]
})
export class SolverModule { }
