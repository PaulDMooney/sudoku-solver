import { Observable, Subject, ReplaySubject, BehaviorSubject } from 'rxjs';
import { skip, filter } from 'rxjs/operators';

export const DEFAULT_STARTING_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export interface CellStatus {
  complete: boolean;
  valueEvent?: ValueOriginType;
  value?: number;
}

export enum ValueOriginType {
  EXPLICIT,
  DERIVED,
  UNSET
}

export enum ValueChangeType {
  SET,
  UNSET
}
export class Cell {

  private possibilities: number[];

  private cellStatus$: Subject<CellStatus> = new BehaviorSubject({complete: false});

  private possibilitiesChange$: Subject<number[]> = new Subject();

  private value?: number;

  private valueOrigin?: ValueOriginType;

  constructor(allOptions: number[] = DEFAULT_STARTING_OPTIONS) {
    this.possibilities = [...allOptions];
  }

  get currentValue(): number {
    return this.value;
  }

  get currentPossibilities(): number[] {
    return this.possibilities;
  }

  eliminatePossibility(option: number): void {

    // Needed check to prevent infinite recursion
    if (this.possibilities.length <= 1 || !this.possibilities.includes(option)) {
      return;
    }

    this.possibilities = this.possibilities.filter(item => item !== option);
    if (!this.value && this.possibilities.length === 1) {
      this.setValueAndOrigin(this.possibilities[0], ValueOriginType.DERIVED);
    }
    this.possibilitiesChange$.next(this.possibilities);
  }

  addPossibility(newPossibility: number): any {

    if (this.value === newPossibility) {
      throw new UnexpectedValue(`${newPossibility} can not be added because it is already the value of this cell`);
    }

    if (this.possibilities.includes(newPossibility)) {
      return;
    }

    this.possibilities.push(newPossibility);
    if (this.valueOrigin === ValueOriginType.DERIVED) {
      this._unsetValue();
    }
  }

  setValue(explicitValue: number): void {
    this.setValueAndOrigin(explicitValue, ValueOriginType.EXPLICIT);
  }

  canSetValue(value: number) {
    return this.possibilities.includes(value);
  }

  unsetValue(): void {

    if (this.valueOrigin === ValueOriginType.DERIVED) {
      throw new UnsupportedOperation('A cell with a DERIVED value cannot be unset');
    }

    this._unsetValue();
  }

  private setValueAndOrigin(explicitValue: number, valueOrigin: ValueOriginType): void {

    // Validate that the value was an available option.
    if (!this.canSetValue(explicitValue)) {
      throw new UnexpectedValue(`${explicitValue} has previously been eliminated as an option.
        The list of options can not be reduced to this value`);
    }

    this.value = explicitValue;
    this.valueOrigin = valueOrigin;
    this.emitValueSet(this.value, this.valueOrigin);

  }

  private _unsetValue(): void {
    if (!this.value) {
      return;
    }

    const unsetEvent: CellStatus = {complete: false, value: this.value, valueEvent: ValueOriginType.UNSET};
    if (!this.possibilities.includes(this.value)) {
      this.possibilities.push(this.value);
    }
    this.value = null;
    this.valueOrigin = null;

    this.cellStatus$.next(unsetEvent);
  }

  private emitValueSet(value: number, valueEvent: ValueOriginType) {
    this.cellStatus$.next({complete: true, value, valueEvent});
  }

  get cellStatus(): Observable<CellStatus> {
    return this.cellStatus$;
  }

  get possibilitiesChange(): Observable<number[]> {
    return this.possibilitiesChange$;
  }
}

export class UnexpectedValue extends Error {

  constructor(message: string) {
    super(message);
  }
}

export class UnsupportedOperation extends Error {

  constructor(message: string) {
    super(message);
  }
}
