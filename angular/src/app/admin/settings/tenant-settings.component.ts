import { Component, OnInit, Injector } from '@angular/core';
import {
    TenantSettingsServiceProxy,
    DefaultTimezoneScope,
    TenantSettingsEditDto,
    SendTestEmailInput
} from '@shared/service-proxies/service-proxies';
import { AppConsts } from '@shared/AppConsts';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppTimezoneScope } from '@shared/AppEnums';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { TokenService } from '@abp/auth/token.service';
import { IAjaxResponse } from '@abp/abpHttpInterceptor';

import * as moment from 'moment';
import { finalize } from 'rxjs/operators';
import { UploadFile } from 'ng-zorro-antd';
import { HttpClient, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { filter } from 'rxjs/internal/operators';
import { UtilsService } from '@abp/utils/utils.service';

@Component({
    templateUrl: './tenant-settings.component.html',
    styleUrls: ['./tenant-settings.component.less'],
    animations: [appModuleAnimation()]
})
export class TenantSettingsComponent extends AppComponentBase implements OnInit {

    usingDefaultTimeZone = false;
    initialTimeZone: string = null;
    testEmailAddress: string = undefined;

    isMultiTenancyEnabled: boolean = this.multiTenancy.isEnabled;
    showTimezoneSelection: boolean = abp.clock.provider.supportsMultipleTimezone;
    activeTabIndex: number = (abp.clock.provider.supportsMultipleTimezone) ? 0 : 1;
    loading = false;
    settings: TenantSettingsEditDto = undefined;

    uploading = false;
    fileList: UploadFile[] = [];

    remoteServiceBaseUrl = AppConsts.remoteServiceBaseUrl;

    defaultTimezoneScope: DefaultTimezoneScope = AppTimezoneScope.Tenant;

    beforeUpload = (file: UploadFile): boolean => {
        this.fileList = [];
        this.fileList.push(file);
        return false;
    }

    constructor(
        injector: Injector,
        private _tenantSettingsService: TenantSettingsServiceProxy,
        private _appSessionService: AppSessionService,
        private _tokenService: TokenService,
        private _utilsService: UtilsService,
        private http: HttpClient
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.testEmailAddress = this._appSessionService.user.emailAddress;
        this.getSettings();
    }

    getSettings(): void {
        this.loading = true;
        this._tenantSettingsService.getAllSettings()
            .pipe(finalize(() => {
                this.loading = false;
            }))
            .subscribe((result: TenantSettingsEditDto) => {
                this.settings = result;
                if (this.settings.general) {
                    this.initialTimeZone = this.settings.general.timezone;
                    this.usingDefaultTimeZone = this.settings.general.timezoneForComparison === abp.setting.values['Abp.Timing.TimeZone'];
                }
            });
    }

    uploadLogo(): void {
        const formData = new FormData();
        // tslint:disable-next-line:no-any
        this.fileList.forEach((file: any) => {
            formData.append('files[]', file);
        });
        this.uploading = true;
        let token = this._tokenService.getToken();

        let headers = new HttpHeaders();
        headers = headers.set('Authorization', 'Bearer ' + token);
        let cookieTenantIdValue = this._utilsService.getCookieValue('Abp.TenantId');
        if (cookieTenantIdValue && headers && !headers.has('Abp.TenantId')) {
            headers = headers.set('Abp.TenantId', cookieTenantIdValue);
        }
        // You can use any AJAX library you like
        const req = new HttpRequest('POST', AppConsts.remoteServiceBaseUrl + '/TenantCustomization/UploadLogo',
            formData, {
                headers: headers
                // reportProgress: true
            });

        this.http
            .request(req)
            .pipe(filter(e => e instanceof HttpResponse))
            .subscribe(
                (response: any) => {
                    const ajaxResponse = <IAjaxResponse>JSON.parse(JSON.stringify(response.body));
                    this.uploading = false;
                    if (ajaxResponse.success) {
                        this.notify.info(this.l('SavedSuccessfully'));
                        this._appSessionService.tenant.logoFileType = ajaxResponse.result.fileType;
                        this._appSessionService.tenant.logoId = ajaxResponse.result.id;
                    } else {
                        this.message.error(ajaxResponse.error.message);
                    }
                },
                err => {
                    this.uploading = false;
                    this.message.error('upload failed.');
                }
            );

    }


    clearLogo(): void {
        this._tenantSettingsService.clearLogo().subscribe(() => {
            this._appSessionService.tenant.logoFileType = null;
            this._appSessionService.tenant.logoId = null;
            this.notify.info(this.l('ClearedSuccessfully'));
        });
    }

    saveAll(): void {
        this._tenantSettingsService.updateAllSettings(this.settings).subscribe(() => {
            this.notify.info(this.l('SavedSuccessfully'));

            if (abp.clock.provider.supportsMultipleTimezone && this.usingDefaultTimeZone && this.initialTimeZone !== this.settings.general.timezone) {
                this.message.info(this.l('TimeZoneSettingChangedRefreshPageNotification')).done(() => {
                    window.location.reload();
                });
            }
        });
    }

    sendTestEmail(): void {
        const input = new SendTestEmailInput();
        input.emailAddress = this.testEmailAddress;
        this._tenantSettingsService.sendTestEmail(input).subscribe(result => {
            this.notify.info(this.l('TestEmailSentSuccessfully'));
        });
    }
}
