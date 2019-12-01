import { Cell, CellStatus } from './cell';
import { Subject, ReplaySubject, forkJoin, Observable, combineLatest, BehaviorSubject } from 'rxjs';

export class CellContainer {

  private containerSolved$: Subject<boolean> = new BehaviorSubject(false);

  constructor(private cells: Cell[]) {

    cells.forEach(cell => subscribeToValueSetEvent(cell, cells));
    console.log('Cells', cells.length);

    // Emit Event when all cells are complete.
    combineLatest(cells.map(cell => cell.cellStatus)).subscribe((values: CellStatus[]) => {

      if (values.filter((status: CellStatus) => !status.complete).length === 0) {

        console.log('Container solved');
        this.containerSolved$.next(true);
      } else {
        this.containerSolved$.next(false);
      }
    });
  }

  public get containerSolvedEvent(): Observable<boolean> {
    return this.containerSolved$;
  }

}

function subscribeToValueSetEvent(cell: Cell, cells: Cell[]) {

  cell.cellStatus.subscribe(status => {
    if (status.complete) {
      console.log('Notifying cells of final value set', status);
      cells.forEach(otherCell => {
        if (otherCell !== cell) {
          otherCell.eliminateOption(status.value);
        }
      });
    }
  });
}
