import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';
import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-date-range-component',
  templateUrl: './date-range-component.component.html',
  styleUrls: ['./date-range-component.component.less']
})
export class DateRangeComponentComponent implements OnInit {

  data: any;
  startDate: any;
  endDate: any;
  @Output() selectedDate: any;
  @Output() selectedType: any;
  @Output() selectedDateChanged: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
    this.refreshRangeType('day');
  }

  refreshDateRange(selectedDate: any): void {
    if (selectedDate === null) {
      this.startDate = moment().startOf(this.selectedType).toDate();
      this.endDate = moment().endOf(this.selectedType).toDate();
    } else {
      switch (this.selectedType) {
        case 'day':
        case 'week':
        case 'month':
        case 'year':
          {
            this.startDate = moment(selectedDate).startOf(this.selectedType).toDate();
            this.endDate = moment(selectedDate).endOf(this.selectedType).toDate();
            break;
          }
        default:
          {
            this.startDate = null;
            this.endDate = null;
          }
      }

      if (selectedDate !== this.data) {
        this.data = this.startDate;
      }
    }

    this.selectedDate = [this.startDate, this.endDate];

    this.selectedDateChanged.emit({ selectedDate: this.selectedDate, selectedType: this.selectedType });
  }

  refreshRangeType(selectedType: any): void {
    this.selectedType = selectedType;

    if (this.data === null || this.data === undefined) {
      this.data = moment().toDate();
    }

    this.refreshDateRange(this.data);
  }
}
