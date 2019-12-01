import { Observable, Subject, ReplaySubject, BehaviorSubject } from 'rxjs';
import { skip, filter } from 'rxjs/operators';

export const DEFAULT_STARTING_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export interface CellStatus {
  complete: boolean;
  value?: number;
}
export class Cell {

  private options: number[];

  private cellStatus$: Subject<CellStatus> = new BehaviorSubject({complete: false});

  constructor(allOptions: number[] = DEFAULT_STARTING_OPTIONS) {
    this.options = [...allOptions];
  }

  eliminateOption(option: number): void {

    // Needed check to prevent infinite recursion
    if (this.options.length <= 1 ) {
      return;
    }

    this.options = this.options.filter(item => item !== option);
    if (this.options.length === 1) {
      this.emitValueSet(this.options[0]);
    }
  }

  eliminateAllOptionsExcept(explicitValue: number): void {
    const potentialOptions = this.options.filter(item => item === explicitValue);

    if (potentialOptions.length === 1) {
      this.options = potentialOptions;
      this.emitValueSet(this.options[0]);
    } else {
      throw new UnexpectedValue(explicitValue);
    }
  }


  private emitValueSet(value: number) {
    console.log('Value set event', value);
    this.cellStatus$.next({complete: true, value});
  }

  get cellStatus(): Observable<CellStatus> {
    return this.cellStatus$;
  }
}

export class UnexpectedValue extends Error {

  constructor(value: number) {
    super(`${value} has previously been eliminated as an option. The list of options can not be reduced to this value`);
  }
}
