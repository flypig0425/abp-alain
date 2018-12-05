import {
    Component,
    OnInit,
    AfterViewInit,
    Injector,
    ViewEncapsulation,
} from '@angular/core';

import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';

@Component({
    templateUrl: './host-dashboard.component.html',
    styleUrls: ['./host-dashboard.component.less'],
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class HostDashboardComponent extends AppComponentBase implements AfterViewInit, OnInit {
    loading = false;

    fullScreen = false;

    constructor(
        injector: Injector,
    ) {
        super(injector);
    }

    ngOnInit(): void {
        abp.event.on('abp.theme-setting.fullscreen', (status) => {
            abp.log.info('toogle full screen ' + status);
            this.fullScreen = status;
        });
    }

    ngAfterViewInit(): void {

    }


}
