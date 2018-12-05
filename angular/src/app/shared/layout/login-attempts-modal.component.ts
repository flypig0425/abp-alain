import { Component, ViewChild, Injector, AfterViewInit } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppConsts } from '@shared/AppConsts';

import {
    UserLoginServiceProxy,
    ProfileServiceProxy,
    UserLoginAttemptDto
} from '@shared/service-proxies/service-proxies';

import * as moment from 'moment';
import { NzModalRef } from 'ng-zorro-antd';

@Component({
    selector: 'loginAttemptsModal',
    templateUrl: './login-attempts-modal.component.html'
})
export class LoginAttemptsModalComponent extends AppComponentBase implements AfterViewInit {
    userLoginAttempts: UserLoginAttemptDto[];
    profilePicture = AppConsts.appBaseUrl + '/assets/common/images/default-profile-picture.png';
    defaultProfilePicture = AppConsts.appBaseUrl + '/assets/common/images/default-profile-picture.png';

    constructor(
        injector: Injector,
        private _userLoginService: UserLoginServiceProxy,
        private _profileService: ProfileServiceProxy,
        private modal: NzModalRef,
    ) {
        super(injector);
    }

    ngAfterViewInit(): void {
        this.show();
    }

    show(): void {
        this._userLoginService.getRecentUserLoginAttempts().subscribe(result => {
            this.userLoginAttempts = result.items;
        });
    }

    close(): void {
        this.modal.destroy();
    }

    getLoginAttemptTime(userLoginAttempt: UserLoginAttemptDto): string {
        return moment(userLoginAttempt.creationTime).fromNow() + ' (' + moment(userLoginAttempt.creationTime).format('YYYY-MM-DD hh:mm:ss') + ')';
    }
}
