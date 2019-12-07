import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { BasicSudokuSolverFormComponent } from './basic-sudoku-solver-form/basic-sudoku-solver-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SudokuSolverInputCellComponent } from './sudoku-solver-input-cell/sudoku-solver-input-cell.component';

@NgModule({
  declarations: [
    AppComponent,
    BasicSudokuSolverFormComponent,
    SudokuSolverInputCellComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
