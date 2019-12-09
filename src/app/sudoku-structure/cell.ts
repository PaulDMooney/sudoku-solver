import { Observable, Subject, ReplaySubject, BehaviorSubject } from 'rxjs';
import { skip, filter } from 'rxjs/operators';

export const DEFAULT_STARTING_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export interface CellStatus {
  complete: boolean;
  valueEvent?: ValueEventType;
  value?: number;
}

export enum ValueEventType {
  EXPLICIT,
  DERIVED,
  UNSET
}
export class Cell {

  private options: number[];

  private cellStatus$: Subject<CellStatus> = new BehaviorSubject({complete: false});

  private value?: number;

  private valueOrigin?: ValueEventType;

  constructor(allOptions: number[] = DEFAULT_STARTING_OPTIONS) {
    this.options = [...allOptions];
  }

  get currentValue() {
    return this.value;
  }

  eliminateOption(option: number): void {

    // Needed check to prevent infinite recursion
    if (this.options.length <= 1 ) {
      return;
    }

    this.options = this.options.filter(item => item !== option);
    if (!this.value && this.options.length === 1) {
      this.setValueAndOrigin(this.options[0], ValueEventType.DERIVED);
    }
  }

  addOption(newOption: number): any {

    if (this.value === newOption) {
      throw new UnexpectedValue(`${newOption} can not be added because it is already the value of this cell`);
    }

    if (this.options.includes(newOption)) {
      return;
    }

    this.options.push(newOption);
    if (this.valueOrigin === ValueEventType.DERIVED) {
      this._unsetValue();
    }
  }

  setValue(explicitValue: number): void {
    this.setValueAndOrigin(explicitValue, ValueEventType.EXPLICIT);
  }

  canSetValue(value: number) {
    return this.options.includes(value);
  }

  unsetValue(): void {

    if (this.valueOrigin === ValueEventType.DERIVED) {
      throw new UnsupportedOperation('A cell with a DERIVED value cannot be unset');
    }

    this._unsetValue();
  }

  private setValueAndOrigin(explicitValue: number, valueOrigin: ValueEventType): void {

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

    const unsetEvent: CellStatus = {complete: false, value: this.value, valueEvent: ValueEventType.UNSET};
    if (!this.options.includes(this.value)) {
      this.options.push(this.value);
    }
    this.value = null;
    this.valueOrigin = null;

    this.cellStatus$.next(unsetEvent);
  }

  private emitValueSet(value: number, valueEvent: ValueEventType) {
    this.cellStatus$.next({complete: true, value, valueEvent});
  }

  get cellStatus(): Observable<CellStatus> {
    return this.cellStatus$;
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
