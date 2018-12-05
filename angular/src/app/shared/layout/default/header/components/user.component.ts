import { Component, OnInit, Injector, ViewEncapsulation } from '@angular/core';
import { AppAuthService } from '@app/shared/common/auth/app-auth.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ImpersonationService } from '@app/admin/users/impersonation.service';
import { AbpSessionService } from 'abp-ng2-module/dist/src/session/abp-session.service';
import { AbpMultiTenancyService } from 'abp-ng2-module/dist/src/multi-tenancy/abp-multi-tenancy.service';
import {
    GetCurrentLoginInformationsOutput, LinkedUserDto,
    SessionServiceProxy,
    TenantLoginInfoDto
} from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { NzModalService } from 'ng-zorro-antd';
import { ChangePasswordModalComponent } from '@app/shared/layout/profile/change-password-modal.component';
import { MySettingsModalComponent } from '@app/shared/layout/profile/my-settings-modal.component';
import { LoginAttemptsModalComponent } from '@app/shared/layout/login-attempts-modal.component';
import { LinkedAccountsModalComponent } from '@app/shared/layout/linked-accounts-modal.component';
import { LinkedAccountService } from '@app/shared/layout/linked-account.service';


@Component({
    selector: 'header-user',
    templateUrl: './user.component.html'
})
export class HeaderUserComponent extends AppComponentBase implements OnInit {

    isImpersonatedLogin = false;
    isMultiTenancyEnabled = false;
    shownLoginNameTitle = '';
    shownLoginName = '';

    tenancyName = '';
    userName = '';

    tenant: TenantLoginInfoDto = new TenantLoginInfoDto();

    constructor(
        injector: Injector,
        private _authService: AppAuthService,
        private _abpSessionService: AbpSessionService,
        private _abpMultiTenancyService: AbpMultiTenancyService,
        private _impersonationService: ImpersonationService,
        private _linkedAccountService: LinkedAccountService,
        private _sessionService: SessionServiceProxy,
        private _appSessionService: AppSessionService,
        private _nzModalService: NzModalService
    ) {
        super(injector);
    }

    ngOnInit() {
        this.isMultiTenancyEnabled = this._abpMultiTenancyService.isEnabled;

        this.isImpersonatedLogin = this._abpSessionService.impersonatorUserId > 0;
        this.shownLoginNameTitle = this.isImpersonatedLogin ? this.l('YouCanBackToYourAccount') : '';

        this.shownLoginName = this.appSession.getShownLoginName();

        this.getCurrentLoginInformations();
    }

    getCurrentLoginInformations(): void {
        this.shownLoginName = this.appSession.getShownLoginName();
        this.tenancyName = this.appSession.tenancyName;
        this.userName = this.appSession.user.userName;

        this._sessionService.getCurrentLoginInformations()
            .subscribe((result: GetCurrentLoginInformationsOutput) => {
                this.tenant = result.tenant;
            });
    }

    changePassword(): void {
        let title = this.l('ChangePassword');

        let modal = this._nzModalService.create({
            nzContent: ChangePasswordModalComponent,
            nzMaskClosable: false,
            nzComponentParams: {},
            nzTitle: title,
            nzFooter: null
        });
    }

    changeMySettings(): void {
        let title = this.l('MySettings');

        let modal = this._nzModalService.create({
            nzContent: MySettingsModalComponent,
            nzMaskClosable: false,
            nzComponentParams: {},
            nzTitle: title,
            nzFooter: null
        });

        modal.afterOpen.subscribe(() => {
            const instance = modal.getContentComponent();
            instance.modalSave.subscribe(() => {
                this.shownLoginName = this.appSession.getShownLoginName();
            });
        });
    }

    showLoginAttempts(): void {
        let title = this.l('LoginAttempts');

        let modal = this._nzModalService.create({
            nzContent: LoginAttemptsModalComponent,
            nzMaskClosable: false,
            nzComponentParams: {},
            nzTitle: title,
            nzWidth: 900,
            nzFooter: null
        });
    }

    backToMyAccount(): void {
        this._impersonationService.backToImpersonator();
    }

    showLinkedAccounts(): void {
        let title = this.l('ManageLinkedAccounts');

        let modal = this._nzModalService.create({
            nzContent: LinkedAccountsModalComponent,
            nzMaskClosable: false,
            nzComponentParams: {},
            nzTitle: title,
            nzWidth: 900,
            nzFooter: null
        });
    }

    switchToLinkedUser(linkedUser: LinkedUserDto): void {
        this._linkedAccountService.switchToAccount(linkedUser.id, linkedUser.tenantId);
    }


    logout(): void {
        this._authService.logout();
    }
}
