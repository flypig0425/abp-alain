import * as ngCommon from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { UtilsModule } from '@shared/utils/utils.module';
import { AbpModule } from '@abp/abp.module';
import { CommonModule } from '@shared/common/common.module';

import { TimeZoneComboComponent } from './timing/timezone-combo.component';
import { AppAuthService } from './auth/app-auth.service';
import { CommonLookupModalComponent } from './lookup/common-lookup-modal.component';
import { DateRangePickerComponent } from './timing/date-range-picker.component';
import { AppRouteGuard } from './auth/auth-route-guard';
import { DateTimeService } from './timing/date-time.service';
import { AppLocalizationService } from '@app/shared/common/localization/app-localization.service';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { DatePickerComponent } from '@app/shared/common/timing/date-picker.component';

@NgModule({
    imports: [
        ngCommon.CommonModule,
        FormsModule,
        UtilsModule,
        AbpModule,
        CommonModule,
        NgZorroAntdModule.forRoot(),
    ],
    declarations: [
        TimeZoneComboComponent,
        CommonLookupModalComponent,
        DateRangePickerComponent,
        DatePickerComponent,
    ],
    exports: [
        TimeZoneComboComponent,
        CommonLookupModalComponent,
        DateRangePickerComponent,
        DatePickerComponent,
    ],
    providers: [
        DateTimeService,
        AppLocalizationService,
    ],
    entryComponents: [
        CommonLookupModalComponent
    ]
})

export class AppCommonModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: AppCommonModule,
            providers: [
                AppAuthService,
                AppRouteGuard
            ]
        };
    }
}
