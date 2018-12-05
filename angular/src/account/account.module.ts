import * as ngCommon from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AbpModule } from '@abp/abp.module';

import { AccountRoutingModule } from './account-routing.module';

import { ServiceProxyModule } from '@shared/service-proxies/service-proxy.module';

import { UtilsModule } from '@shared/utils/utils.module';
import { CommonModule } from '@shared/common/common.module';

import { AccountComponent } from './account.component';
import { TenantChangeComponent } from './shared/tenant-change.component';
import { TenantChangeModalComponent } from './shared/tenant-change-modal.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './password/forgot-password.component';
import { ResetPasswordComponent } from './password/reset-password.component';
import { EmailActivationComponent } from './email-activation/email-activation.component';
import { ConfirmEmailComponent } from './email-activation/confirm-email.component';
import { LoginService } from './login/login.service';
import { SendTwoFactorCodeComponent } from './login/send-two-factor-code.component';
import { ValidateTwoFactorCodeComponent } from './login/validate-two-factor-code.component';
import { LanguageSwitchComponent } from './language-switch.component';

import { NgZorroAntdModule } from 'ng-zorro-antd';
import { HttpClientModule } from '@angular/common/http';
import { DelonABCModule } from '@delon/abc';

@NgModule({
    imports: [
        ngCommon.CommonModule,
        FormsModule,
        HttpClientModule,

        AbpModule,

        CommonModule,

        UtilsModule,
        ServiceProxyModule,
        AccountRoutingModule,
        NgZorroAntdModule.forRoot(),
        DelonABCModule,
    ],
    declarations: [
        AccountComponent,
        TenantChangeComponent,
        TenantChangeModalComponent,
        LoginComponent,
        RegisterComponent,
        ForgotPasswordComponent,
        ResetPasswordComponent,
        EmailActivationComponent,
        ConfirmEmailComponent,
        SendTwoFactorCodeComponent,
        ValidateTwoFactorCodeComponent,
        LanguageSwitchComponent,
    ],
    providers: [
        LoginService,
    ],
    entryComponents: [
        TenantChangeModalComponent
    ]
})
export class AccountModule {

}
