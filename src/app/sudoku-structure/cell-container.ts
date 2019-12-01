import { Cell } from './cell';
import { Subject, ReplaySubject, forkJoin, Observable } from 'rxjs';

export class CellContainer {

  private containerSolved$: Subject<boolean> = new ReplaySubject(1);

  constructor(private cells: Cell[]) {

    cells.forEach(cell => subscribeToValueSetEvent(cell, cells));
    console.log('Cells', cells.length);

    // Emit Event when all cells are complete.
    forkJoin(cells.map(cell => cell.value)).subscribe((values: number[]) => {
      console.log('Container solved');
      this.containerSolved$.next(true);
      this.containerSolved$.complete();
    });
  }

  public get containerSolvedEvent(): Observable<boolean> {
    return this.containerSolved$;
  }

}

function subscribeToValueSetEvent(cell: Cell, cells: Cell[]) {

  cell.value.subscribe(value => {
    console.log('Notifying cells of final value set', value);
    cells.forEach(otherCell => {
      if (otherCell !== cell) {
        otherCell.eliminateOption(value);
      }
    });
  });
}
