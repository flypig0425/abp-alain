import { Component, OnInit, ViewChild, Injector, ElementRef, AfterViewInit } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import {
    ProfileServiceProxy,
    ChangePasswordInput,
    PasswordComplexitySetting
} from '@shared/service-proxies/service-proxies';
import { NzModalRef } from 'ng-zorro-antd';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'changePasswordModal',
    templateUrl: './change-password-modal.component.html'
})
export class ChangePasswordModalComponent extends AppComponentBase implements AfterViewInit {

    passwordComplexitySetting: PasswordComplexitySetting = new PasswordComplexitySetting();
    currentPassword: string;
    password: string;
    confirmPassword: string;

    saving = false;

    constructor(
        injector: Injector,
        private _profileService: ProfileServiceProxy,
        private modal: NzModalRef,
    ) {
        super(injector);
    }

    ngAfterViewInit(): void {
        this.show();
    }

    show(): void {
        this.currentPassword = '';
        this.password = '';
        this.confirmPassword = '';

        this._profileService.getPasswordComplexitySetting().subscribe(result => {
            this.passwordComplexitySetting = result.setting;
        });
    }

    close(): void {
        this.modal.destroy();
    }

    save(): void {
        let input = new ChangePasswordInput();
        input.currentPassword = this.currentPassword;
        input.newPassword = this.password;

        this.saving = true;
        this._profileService.changePassword(input)
            .pipe(finalize(() => {
                this.saving = false;
            }))
            .subscribe(() => {
                this.notify.info(this.l('YourPasswordHasChangedSuccessfully'));
                this.close();
            });
    }
}
