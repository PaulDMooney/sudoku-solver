import { Cell, CellStatus, ValueOriginType } from './cell';
import { Subject, ReplaySubject, forkJoin, Observable, combineLatest, BehaviorSubject } from 'rxjs';
import { bufferToggle, mergeAll, buffer, concatAll, timeout, combineAll } from 'rxjs/operators';
import { matchCellsWithLikeOptions } from './match-cells';
import { deriveCellsWithUniqueOptions } from './derive-cells';

export class CellContainer {

  private containerSolved$: Subject<boolean> = new BehaviorSubject(false);

  constructor(public cells: Cell[]) {
    cells.forEach(cell => cell.registerCellContainer(this));

    // cells.forEach(cell => {
    //   subscribeToValueSetEvent(cell, cells);
    //   subscribeToOptionsChangeEvent(cell, cells);
    // });

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

  removeOption(value: number, originatingCell: Cell): Observable<any> {
    console.log(`Removing option value ${value}` )
    return combineLatest(this.cells
      .filter(cell => cell !== originatingCell)
      .map(cell => cell.eliminateOption(value))
    );
  }

  public get containerSolvedEvent(): Observable<boolean> {
    return this.containerSolved$;
  }
}

function subscribeToValueSetEvent(cell: Cell, allCells: Cell[]) {
  const otherCells = allCells.filter(value => value !== cell);
  cell.cellStatus.subscribe(status => changeOtherCellOptions(status, otherCells));
}

function changeOtherCellOptions(status: CellStatus, otherCells: Cell[]) {
  if (status.complete) {
    // console.log('Notifying cells of final value set', status);
    otherCells.forEach(otherCell => {
      otherCell.eliminateOption(status.value);
    });
  }
}

function subscribeToOptionsChangeEvent(cell: Cell, allCells: Cell[]) {

  cell.optionsChange.subscribe(() => {
    matchCellsWithLikeOptions(allCells);
    deriveCellsWithUniqueOptions(allCells);
  });
}
