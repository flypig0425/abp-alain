import { NgModule } from '@angular/core';
import * as ngCommon from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FileUploadModule } from 'ng2-file-upload';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChangeProfilePictureModalComponent } from '@app/shared/layout/profile/change-profile-picture-modal.component';
import { SmsVerificationModalComponent } from '@app/shared/layout/profile/sms-verification-modal.component';
import { AbpModule } from '@abp/abp.module';
import { UtilsModule } from '@shared/utils/utils.module';
import { AppCommonModule } from './shared/common/app-common.module';
import { ServiceProxyModule } from '@shared/service-proxies/service-proxy.module';
import { ImpersonationService } from './admin/users/impersonation.service';
import { LinkedAccountService } from './shared/layout/linked-account.service';
import { LinkedAccountsModalComponent } from '@app/shared/layout/linked-accounts-modal.component';
import { LinkAccountModalComponent } from '@app/shared/layout/link-account-modal.component';
import { UserNotificationHelper } from './shared/layout/notifications/UserNotificationHelper';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { LayoutModule } from '@app/shared/layout/layout.module';
import { HttpClientModule } from '@angular/common/http';
import { DelonModule } from '../delon.module';
import { AlainThemeModule } from '@delon/theme';
import { DelonABCModule } from '@delon/abc';
import { ImageCropperModule } from 'ngx-image-cropper';

@NgModule({
    declarations: [
        AppComponent,
        LinkedAccountsModalComponent,
        LinkAccountModalComponent,
        ChangeProfilePictureModalComponent,
        SmsVerificationModalComponent,
    ],
    imports: [
        ngCommon.CommonModule,
        FormsModule,
        HttpClientModule,
        NgZorroAntdModule.forRoot(),
        DelonModule.forRoot(),
        FileUploadModule,
        AbpModule,
        AppRoutingModule,
        UtilsModule,
        AppCommonModule.forRoot(),
        ServiceProxyModule,
        LayoutModule,
        AlainThemeModule.forChild(),
        DelonABCModule,
        ImageCropperModule
    ],
    providers: [
        ImpersonationService,
        LinkedAccountService,
        UserNotificationHelper,

    ]
})
export class AppModule { }
