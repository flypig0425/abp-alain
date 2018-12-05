import { Component, OnInit, ElementRef, ViewChild, Injector, Input, Output, EventEmitter } from '@angular/core';
import { TimingServiceProxy, NameValueDto, DefaultTimezoneScope } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    selector: 'timezone-combo',
    template:
    `<nz-select nzShowSearch nzAllowClear #TimeZoneCombobox
        [(ngModel)]="selectedTimeZone"
        (ngModelChange)="selectedTimeZoneChange.emit($event)">
            <nz-option *ngFor="let timeZone of timeZones" [nzLabel]="timeZone.name" [nzValue]="timeZone.value"></nz-option>
    </nz-select>`
})
export class TimeZoneComboComponent extends AppComponentBase implements OnInit {

    @Output() selectedTimeZoneChange: EventEmitter<string> = new EventEmitter<string>();

    timeZones: NameValueDto[] = [];

    @Input() selectedTimeZone: string = undefined;
    @Input() defaultTimezoneScope: DefaultTimezoneScope;

    constructor(
        private _timingService: TimingServiceProxy,
        injector: Injector) {
        super(injector);
    }

    ngOnInit(): void {
        let self = this;
        self._timingService.getTimezones(self.defaultTimezoneScope).subscribe(result => {
            self.timeZones = result.items;
        });
    }
}
