import { CellContainer } from './cell-container';
import { ReplaySubject, Observable, Subject, forkJoin, combineLatest, BehaviorSubject } from 'rxjs';

export class Board {

  boardSolved$: Subject<boolean> = new BehaviorSubject(false);

  constructor(private cellContainers: CellContainer[]) {

    combineLatest(cellContainers.map(cellContainer => cellContainer.containerSolvedEvent))
      .subscribe((statuses: boolean[]) => {

        const boardStatus = statuses.filter(status => !status).length === 0;
        this.boardSolved$.next(boardStatus);
      });
  }

  get boardSolved(): Observable<boolean> {
    return this.boardSolved$;
  }
}
