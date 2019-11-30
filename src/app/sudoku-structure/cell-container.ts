import { Cell } from './cell';

export class CellContainer {
  constructor(private cells: Cell[]) {

    cells.forEach(cell => subscribeToValueSetEvent(cell, cells));
  }

}

function subscribeToValueSetEvent(cell: Cell, cells: Cell[]) {

  cell.valueSetEvent.subscribe(value => {
    cells.forEach(otherCell => {
      if (otherCell !== cell) {
        otherCell.eliminateOption(value);
      }
    });
  });
}
