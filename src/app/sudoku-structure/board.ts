import { CellContainer } from './cell-container';
import { ReplaySubject, Observable, Subject, forkJoin } from 'rxjs';

export class Board {

  boardSolved$: Subject<boolean> = new ReplaySubject(1);

  constructor(private cellContainers: CellContainer[]) {

    forkJoin(cellContainers.map(cellContainer => cellContainer.containerSolvedEvent))
      .subscribe((values: boolean[]) => {
        this.boardSolved$.next(true);
      });
  }

  get boardSolved(): Observable<boolean> {
    return this.boardSolved$;
  }
}
