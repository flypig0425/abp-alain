import { Component, AfterViewInit, ElementRef, ViewChild, Injector, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';

import * as moment from 'moment';

@Component({
    selector: 'date-range-picker',
    template:
            `
        <nz-range-picker [(ngModel)]="dateRange" [nzRanges]="ranges" [nzDisabled]="isDisabled"
                         (ngModelChange)="dateRangeChangeMethod()">
        </nz-range-picker>
    `
})
export class DateRangePickerComponent extends AppComponentBase implements OnInit, AfterViewInit {

    _startDate: moment.Moment = moment().subtract(6, 'days').startOf('day');
    _endDate: moment.Moment = moment().startOf('day');

    dateRange = [];

    @Input() isDisabled = false;

    @Output() startDateChange = new EventEmitter();
    @Output() endDateChange = new EventEmitter();
    @Output() dateRangeChange = new EventEmitter();

    @Input()
    get startDate() {
        return this._startDate;
    }

    set startDate(val) {
        this._startDate = val;
        this.startDateChange.emit(this._startDate);
    }

    @Input()
    get endDate() {
        return this._endDate;
    }

    set endDate(val) {
        this._endDate = val;
        this.endDateChange.emit(this._endDate);
    }

    ranges = {};

    constructor(
        injector: Injector,
        private _element: ElementRef
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.dateRange = [this._startDate.toDate(), this._endDate.toDate()];
    }

    ngAfterViewInit(): void {
        const self = this;

        this.ranges[self.l('Today')] = [moment().startOf('day').toDate(),
            moment().endOf('day').toDate()];
        this.ranges[self.l('Yesterday')] = [moment().subtract(1, 'days').startOf('day').toDate(),
            moment().subtract(1, 'days').endOf('day').toDate()];
        this.ranges[self.l('Last7Days')] = [moment().subtract(6, 'days').startOf('day').toDate(),
            moment().endOf('day').toDate()];
        this.ranges[self.l('Last30Days')] = [moment().subtract(29, 'days').startOf('day').toDate(),
            moment().endOf('day').toDate()];
        this.ranges[self.l('ThisMonth')] = [moment().startOf('month').toDate(), moment().endOf('month').toDate()];
        this.ranges[self.l('LastMonth')] = [moment().subtract(1, 'month').startOf('month').toDate(),
            moment().subtract(1, 'month').endOf('month').toDate()];
    }

    dateRangeChangeMethod(): void {
        this.startDate = moment(this.dateRange[0]);
        this.endDate = moment(this.dateRange[1]);

        this.dateRangeChange.emit(this.dateRange);
    }


}
