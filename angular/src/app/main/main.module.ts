import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';

import { AppCommonModule } from '@app/shared/common/app-common.module';
import { UtilsModule } from '@shared/utils/utils.module';
import { MainRoutingModule } from './main-routing.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';

import { DateRangeComponentComponent } from './shared/date-range-component/date-range-component.component';
import { DelonModule } from '../../delon.module';
import { AlainThemeModule } from '@delon/theme';
import { DelonABCModule } from '@delon/abc';
import { DelonACLModule } from '@delon/acl';
import { DelonFormModule } from '@delon/form';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        AppCommonModule,
        UtilsModule,
        MainRoutingModule,
        NgZorroAntdModule.forRoot(),
        AlainThemeModule.forChild(),
        DelonABCModule,
        DelonACLModule,
        DelonFormModule,
        DelonModule.forRoot(),
    ],
    declarations: [
        // ViewDeviceModalComponent,
        DashboardComponent,
        DateRangeComponentComponent,
    ],
    providers: [],
    exports: [],
    entryComponents: [
    ]

})
export class MainModule {
}
