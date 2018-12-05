import * as ngCommon from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { AbpModule } from '@abp/abp.module';

import { AppSessionService } from './session/app-session.service';
import { AppUrlService } from './nav/app-url.service';
import { CustomNotifyService } from '@shared/common/notify/custom-notify.service';
import { CustomMessageService } from '@shared/common/message/custom-message.service';

@NgModule({
    imports: [
        ngCommon.CommonModule,
        AbpModule
    ]
})
export class CommonModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: CommonModule,
            providers: [
                AppSessionService,
                AppUrlService,
                CustomNotifyService,
                CustomMessageService
            ]
        };
    }
}
