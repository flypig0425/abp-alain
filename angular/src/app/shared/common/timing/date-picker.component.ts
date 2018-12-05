import {
    Directive,
    AfterViewInit,
    ElementRef,
    ViewChild,
    Injector,
    Input,
    Output,
    EventEmitter,
    HostListener, Component
} from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';

import * as moment from 'moment';

@Component({
    selector: 'datePicker',
    template:
            `
        <nz-date-picker [(ngModel)]="date" (ngModelChange)="dateChange($event)"></nz-date-picker>
    `
})
export class DatePickerComponent extends AppComponentBase {

    hostElement: ElementRef;

    _selectedDate: moment.Moment = moment().startOf('day');
    @Output() selectedDateChange = new EventEmitter();

    date = new Date();

    @Input()
    get selectedDate() {
        return this._selectedDate;
    }

    set selectedDate(val) {
        this._selectedDate = val;
        this.selectedDateChange.emit(this._selectedDate);
        this.date = this._selectedDate.toDate();
    }

    constructor(
        injector: Injector,
        private _element: ElementRef
    ) {
        super(injector);
        this.hostElement = _element;
    }

    dateChange(result: Date): void {
        this.selectedDate = moment(result);
    }
}
