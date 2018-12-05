import * as moment from 'moment';
import { AppConsts } from '@shared/AppConsts';
import { UrlHelper } from './shared/helpers/UrlHelper';
import { SubdomainTenancyNameFinder } from '@shared/helpers/SubdomainTenancyNameFinder';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Type, CompilerOptions, NgModuleRef } from '@angular/core';
import { UtilsService } from '@abp/utils/utils.service';
import { AppAuthService } from '@app/shared/common/auth/app-auth.service';
import { HttpClient } from '@angular/common/http';
import { ACLService } from '@delon/acl';
import { MenuService } from '@delon/theme';

import * as _ from 'lodash';
import { ICONS_AUTO } from './style-icons-auto';
import { ICONS } from './style-icons';
import { NzIconService } from 'ng-zorro-antd';

export class AppPreBootstrap {

    constructor(
        private httpClient: HttpClient,
        private aclService: ACLService,
        private menuService: MenuService,
        private iconSrv: NzIconService
    ) {
        iconSrv.addIcon(...ICONS_AUTO, ...ICONS);
    }

    private static setEncryptedTokenCookie(encryptedToken: string) {
        new UtilsService().setCookieValue(AppConsts.authorization.encrptedAuthTokenName,
            encryptedToken,
            new Date(new Date().getTime() + 365 * 86400000), //1 year
            abp.appPath,
        );
    }

    private static getCurrentClockProvider(currentProviderName: string): abp.timing.IClockProvider {
        if (currentProviderName === 'unspecifiedClockProvider') {
            return abp.timing.unspecifiedClockProvider;
        }

        if (currentProviderName === 'utcClockProvider') {
            return abp.timing.utcClockProvider;
        }

        return abp.timing.localClockProvider;
    }

    static bootstrap<TM>(moduleType: Type<TM>, compilerOptions?: CompilerOptions | CompilerOptions[]): Promise<NgModuleRef<TM>> {
        return platformBrowserDynamic().bootstrapModule(moduleType, compilerOptions);
    }

    private getApplicationConfig(appRootUrl: string, callback: () => void) {
        this.httpClient.get<any>(appRootUrl + 'assets/appconfig.json', {
                headers: {
                },
            },
        ).subscribe(result => {
            const subdomainTenancyNameFinder = new SubdomainTenancyNameFinder();
            const tenancyName = subdomainTenancyNameFinder.getCurrentTenancyNameOrNull(result.appBaseUrl);

            AppConsts.appBaseUrlFormat = result.appBaseUrl;
            AppConsts.remoteServiceBaseUrlFormat = result.remoteServiceBaseUrl;
            AppConsts.localeMappings = result.localeMappings;

            if (tenancyName == null) {
                AppConsts.appBaseUrl = result.appBaseUrl.replace(AppConsts.tenancyNamePlaceHolderInUrl + '.', '');
                AppConsts.remoteServiceBaseUrl = result.remoteServiceBaseUrl.replace(AppConsts.tenancyNamePlaceHolderInUrl + '.', '');
            } else {
                AppConsts.appBaseUrl = result.appBaseUrl.replace(AppConsts.tenancyNamePlaceHolderInUrl, tenancyName);
                AppConsts.remoteServiceBaseUrl = result.remoteServiceBaseUrl.replace(AppConsts.tenancyNamePlaceHolderInUrl, tenancyName);
            }

            callback();
        });

    }

    run(appRootUrl: string, callback: () => void, resolve: any, reject: any): void {
        this.getApplicationConfig(appRootUrl, () => {
            if (UrlHelper.isInstallUrl(location.href)) {
                callback();
                return;
            }

            const queryStringObj = UrlHelper.getQueryParameters();

            if (queryStringObj.redirect && queryStringObj.redirect === 'TenantRegistration') {
                if (queryStringObj.forceNewRegistration) {
                    new AppAuthService().logout();
                }

                location.href = AppConsts.appBaseUrl + '/account/select-edition';
            } else if (queryStringObj.impersonationToken) {
                this.impersonatedAuthenticate(queryStringObj.impersonationToken, queryStringObj.tenantId, () => {
                    this.getUserConfiguration(callback);
                });
            } else if (queryStringObj.switchAccountToken) {
                this.linkedAccountAuthenticate(queryStringObj.switchAccountToken, queryStringObj.tenantId, () => {
                    this.getUserConfiguration(callback);
                });
            } else {
                this.getUserConfiguration(callback);
            }
        });
    }


    private impersonatedAuthenticate(impersonationToken: string, tenantId: number, callback: () => void) {
        abp.multiTenancy.setTenantIdCookie(tenantId);
        const cookieLangValue = abp.utils.getCookieValue('Abp.Localization.CultureName');

        this.httpClient.post<any>(AppConsts.remoteServiceBaseUrl + '/api/TokenAuth/ImpersonatedAuthenticate?impersonationToken=' + impersonationToken,
            {
                headers: {
                    '.AspNetCore.Culture': ('c=' + cookieLangValue + '|uic=' + cookieLangValue),
                    'Abp.TenantId': abp.multiTenancy.getTenantIdCookie(),
                },
            })
            .subscribe(data => {
                let result = data.result;

                abp.auth.setToken(result.accessToken);
                AppPreBootstrap.setEncryptedTokenCookie(result.encryptedAccessToken);
                location.search = '';
                callback();
            });
    }

    private linkedAccountAuthenticate(switchAccountToken: string, tenantId: number, callback: () => void): void {
        abp.multiTenancy.setTenantIdCookie(tenantId);
        const cookieLangValue = abp.utils.getCookieValue('Abp.Localization.CultureName');

        this.httpClient.post<any>(
            AppConsts.remoteServiceBaseUrl + '/api/TokenAuth/LinkedAccountAuthenticate?switchAccountToken=' + switchAccountToken,
            {
                headers: {
                    '.AspNetCore.Culture': ('c=' + cookieLangValue + '|uic=' + cookieLangValue),
                    'Abp.TenantId': abp.multiTenancy.getTenantIdCookie(),
                },
            })
            .subscribe(data => {
                let result = data.result;
                abp.auth.setToken(result.accessToken);
                AppPreBootstrap.setEncryptedTokenCookie(result.encryptedAccessToken);
                location.search = '';
                callback();
            });
    }

    private getUserConfiguration(callback: () => void): void {
        const cookieLangValue = abp.utils.getCookieValue('Abp.Localization.CultureName');
        const token = abp.auth.getToken();

        let requestHeaders = {
            '.AspNetCore.Culture': ('c=' + cookieLangValue + '|uic=' + cookieLangValue),
        };

        if (abp.multiTenancy.getTenantIdCookie()) {
            requestHeaders['Abp.TenantId'] = abp.multiTenancy.getTenantIdCookie().toString();
        }

        if (token) {
            requestHeaders['Authorization'] = 'Bearer ' + token;
        }

        // menu data and language data ??
        this.httpClient.get<any>(AppConsts.remoteServiceBaseUrl + '/AbpUserConfiguration/GetAll',
            { headers: requestHeaders })
            .subscribe(configData => {
                let result = configData.result;

                _.merge(abp, result);

                abp.clock.provider = AppPreBootstrap.getCurrentClockProvider(result.clock.provider);

                moment.locale(abp.localization.currentLanguage.name);
                (window as any).moment.locale(abp.localization.currentLanguage.name);

                if (abp.clock.provider.supportsMultipleTimezone) {
                    moment.tz.setDefault(abp.timing.timeZoneInfo.iana.timeZoneId);
                    (window as any).moment.tz.setDefault(abp.timing.timeZoneInfo.iana.timeZoneId);
                }

                abp.event.trigger('abp.dynamicScriptsInitialized');

                // ng-alain acl and menu service
                this.aclService.setFull(false);
                this.aclService.setRole(this.getRoles(result.auth.grantedPermissions));

                callback();
            });
    }

    private getRoles(grantedPermissions): string[] {
        let roles = [];
        for (const key in grantedPermissions) {
            if (grantedPermissions.hasOwnProperty(key)) {
                const value = grantedPermissions[key];
                if (value.toString().toLowerCase() == 'true') {
                    roles.push(key);
                }
            }
        }
        return roles;
    }

}
