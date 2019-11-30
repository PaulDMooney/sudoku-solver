import { Observable, Subject, ReplaySubject, BehaviorSubject } from 'rxjs';
import { skip, filter } from 'rxjs/operators';

export const DEFAULT_STARTING_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export class Cell {

  private options: number[];

  private valueSet: Subject<number> = new ReplaySubject(1);

  constructor(allOptions: number[] = DEFAULT_STARTING_OPTIONS) {
    this.options = [...allOptions];
  }

  eliminateOption(option: number): void {

    this.options = this.options.filter(item => item !== option);
    if (this.options.length === 1) {
      this.valueSet.next(this.options[0]);
    }
  }

  eliminateAllOptionsExcept(explicitValue: number): void {
    const potentialOptions = this.options.filter(item => item === explicitValue);

    if (potentialOptions.length === 1) {
      this.options = potentialOptions;
      this.valueSet.next(this.options[0]);
    } else {
      throw new UnexpectedValue(explicitValue);
    }
  }

  get valueSetEvent() {
    return this.valueSet;
  }
}

export class UnexpectedValue extends Error {

  constructor(value: number) {
    super(`${value} has previously been eliminated as an option. The list of options can not be reduced to this value`);
  }
}
