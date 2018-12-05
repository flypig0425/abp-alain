import {
    Component,
    Injector,
    Output,
    EventEmitter,
    OnInit
} from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppConsts } from '@shared/AppConsts';
import {
    ProfileServiceProxy,
    CurrentUserProfileEditDto,
    DefaultTimezoneScope
} from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { AppTimezoneScope } from '@shared/AppEnums';
import { NzModalRef } from 'ng-zorro-antd';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'mySettingsModal',
    templateUrl: './my-settings-modal.component.html'
})
export class MySettingsModalComponent extends AppComponentBase implements OnInit {

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    public saving = false;
    public isPhoneNumberConfirmed: boolean;
    public isPhoneNumberEmpty = false;
    public smsEnabled: boolean;
    public user: CurrentUserProfileEditDto;
    public showTimezoneSelection: boolean = abp.clock.provider.supportsMultipleTimezone;
    public canChangeUserName: boolean;
    public defaultTimezoneScope: DefaultTimezoneScope = AppTimezoneScope.User;
    private _initialTimezone: string = undefined;

    constructor(
        injector: Injector,
        private _profileService: ProfileServiceProxy,
        private _appSessionService: AppSessionService,
        private modal: NzModalRef,
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.show();
    }

    show(): void {
        this._profileService.getCurrentUserProfileForEdit().subscribe((result) => {
            this.smsEnabled = this.setting.getBoolean('App.UserManagement.SmsVerificationEnabled');
            this.user = result;
            this._initialTimezone = result.timezone;
            this.canChangeUserName = this.user.userName !== AppConsts.userManagement.defaultAdminUserName;
            this.isPhoneNumberConfirmed = result.isPhoneNumberConfirmed;
            this.isPhoneNumberEmpty = result.phoneNumber === '';
        });
    }

    changePhoneNumberToVerified(): void {
        this.isPhoneNumberConfirmed = true;
    }


    close(): void {
        this.modal.destroy();
    }

    save(): void {
        this.saving = true;
        this._profileService.updateCurrentUserProfile(this.user)
            .pipe(finalize(() => {
                this.saving = false;
            }))
            .subscribe(() => {
                this._appSessionService.user.name = this.user.name;
                this._appSessionService.user.surname = this.user.surname;
                this._appSessionService.user.userName = this.user.userName;
                this._appSessionService.user.emailAddress = this.user.emailAddress;

                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit(null);

                if (abp.clock.provider.supportsMultipleTimezone && this._initialTimezone !== this.user.timezone) {
                    this.message.info(this.l('TimeZoneSettingChangedRefreshPageNotification')).done(() => {
                        window.location.reload();
                    });
                }
            });
    }

}
