import { Cell, CellStatus, ValueOriginType } from './cell';
import { Subject, ReplaySubject, forkJoin, Observable, combineLatest, BehaviorSubject } from 'rxjs';
import { bufferToggle, mergeAll, buffer, concatAll, timeout, combineAll, takeUntil, map, flatMap, last, takeLast } from 'rxjs/operators';
import { matchCellsWithLikeOptions } from './match-cells';
import { deriveCellsWithUniqueOptions } from './derive-cells';

export class CellContainer {

  private containerSolved$: Subject<boolean> = new BehaviorSubject(false);

  private reset$: Subject<boolean> = new Subject();

  constructor(public cells: Cell[]) {
    cells.forEach(cell => cell.registerCellContainer(this));

    // cells.forEach(cell => {
    //   subscribeToValueSetEvent(cell, cells);
    //   subscribeToOptionsChangeEvent(cell, cells);
    // });

    // Emit Event when all cells are complete.
    this.subscribeToCellStatus(cells);
  }

  private subscribeToCellStatus(cells: Cell[]) {
    combineLatest(cells.map(cell => cell.cellStatus))
    .pipe(takeUntil(this.reset$))
    .subscribe((values: CellStatus[]) => {

      if (values.filter((status: CellStatus) => !status.complete).length === 0) {

        console.log('Container solved');
        this.containerSolved$.next(true);
      } else {
        this.containerSolved$.next(false);
      }
    });
  }

  removeOption(value: number, originatingCell: Cell): Observable<any> {
    console.log(`Removing option value ${value}` )
    return combineLatest(this.cells
      .filter(cell => cell !== originatingCell)
      .map(cell => cell.eliminateOption(value))
    ).pipe(
      last()
    );
  }

  optionsChanged(value: number, originatingCell: Cell): Observable<any> {
    return onOptionsChange(originatingCell, this.cells);
  }

  public get containerSolvedEvent(): Observable<boolean> {
    return this.containerSolved$;
  }

  reset(): void {
    this.reset$.next(true);
    this.subscribeToCellStatus(this.cells);
  }
}

function changeOtherCellOptions(status: CellStatus, otherCells: Cell[]) {
  if (status.complete) {
    // console.log('Notifying cells of final value set', status);
    otherCells.forEach(otherCell => {
      otherCell.eliminateOption(status.value);
    });
  }
}


function onOptionsChange(cell: Cell, allCells: Cell[]): Observable<any> {

    const matchCells = forkJoin(matchCellsWithLikeOptions(allCells));
    const derivedCells = forkJoin(deriveCellsWithUniqueOptions(allCells));
    return forkJoin(matchCells, derivedCells);

}
