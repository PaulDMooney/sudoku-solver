import { Component, OnInit } from '@angular/core';
import { Board, boardFactory } from '@app/sudoku-structure/board';

@Component({
  templateUrl: './solver.component.html',
  styleUrls: ['./solver.component.scss']
})
export class SolverComponent implements OnInit {

  board: Board;

  constructor() {
    this.board = boardFactory(3);
  }

  ngOnInit() {

  }

}
