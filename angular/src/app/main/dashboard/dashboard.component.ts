import { Component, AfterViewInit, Injector, ViewEncapsulation, ElementRef, ViewChild } from '@angular/core';
import { TenantDashboardServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import * as _ from 'lodash';

@Component({
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.less'],
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class DashboardComponent extends AppComponentBase implements AfterViewInit {
    equipmentPieData: any;
    equipmentTotal = 0;

    constructor(
        injector: Injector,
        private _dashboardService: TenantDashboardServiceProxy
    ) {
        super(injector);

    }

    getDashboardStatisticsData(datePeriod): void {

    }

    ngAfterViewInit(): void {
    }
}

