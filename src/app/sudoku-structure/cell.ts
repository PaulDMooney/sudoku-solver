import { Observable, Subject, ReplaySubject, BehaviorSubject, empty, combineLatest, of, forkJoin } from 'rxjs';
import { skip, filter, throttle, last } from 'rxjs/operators';
import { CellContainer } from './cell-container';

export const DEFAULT_STARTING_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export interface CellStatus {
  complete: boolean;
  valueEvent?: ValueOriginType;
  value?: number;
}

export enum ValueOriginType {
  EXPLICIT,
  DERIVED
}

export enum ValueChangeType {
  SET,
  UNSET
}
export class Cell {

  private options: number[];

  private cellStatus$: Subject<CellStatus>;

  private optionsChangeTrigger$: Subject<number[]> ;

  private value?: number;

  private valueOrigin?: ValueOriginType;

  private cellContainers: CellContainer[] = [];

  constructor(private allOptions: number[] = DEFAULT_STARTING_OPTIONS) {
    this.reset();
  }

  get currentValue(): number {
    return this.value;
  }

  get currentOptions(): number[] {
    return this.options;
  }

  reset() {
    this.options = [...this.allOptions];
    this.value = null;
    this.valueOrigin = null;
    this.cellStatus$ = new BehaviorSubject({complete: false});
    this.optionsChangeTrigger$ = new Subject();
  }

  registerCellContainer(cellContainer: CellContainer) {

    // TODO: Use a Set instead
    if (!this.cellContainers.includes(cellContainer)) {
      this.cellContainers.push(cellContainer);
    }
  }

  eliminateOption(option: number): Observable<any> {

    // Needed check to prevent infinite recursion
    if (this.options.length <= 1 || !this.options.includes(option)) {
      return of(true);
    }

    this.options = this.options.filter(item => item !== option);
    if (!this.value && this.options.length === 1) {
      return this.setValueAndOrigin(this.options[0], ValueOriginType.DERIVED);
    }
    this.optionsChangeTrigger$.next(this.options);
    return forkJoin(this.cellContainers.map(cellContainer => cellContainer.optionsChanged(option, this)));
  }

  setValue(explicitValue: number): Observable<any> {

    return this.setValueAndOrigin(explicitValue, ValueOriginType.EXPLICIT);

  }

  canSetValue(value: number) {
    return this.options.includes(value);
  }

  setValueAndOrigin(explicitValue: number, valueOrigin: ValueOriginType): Observable<any> {

    // Validate that the value was an available option.
    if (!this.canSetValue(explicitValue)) {
      throw new UnexpectedValue(`${explicitValue} has previously been eliminated as an option.
        The list of options can not be reduced to this value`);
    }

    this.value = explicitValue;
    this.valueOrigin = valueOrigin;
    this.emitValueSet(this.value, this.valueOrigin);


    const newOptions = this.options.filter(value => value === explicitValue);
    if (newOptions.toString() !== this.options.toString()) {
      this.options = newOptions;
    }

    return combineLatest(
      this.cellContainers.map(cellContainer => cellContainer.removeOption(this.value, this))
    ).pipe(last());
  }

  private emitValueSet(value: number, valueEvent: ValueOriginType) {
    this.cellStatus$.next({complete: true, value, valueEvent});
  }

  get cellStatus(): Observable<CellStatus> {
    return this.cellStatus$;
  }

  get optionsChange(): Observable<number[]> {
    return this.optionsChangeTrigger$;
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
