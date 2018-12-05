import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, Injector, APP_INITIALIZER, LOCALE_ID } from '@angular/core';
import { registerLocaleData, PlatformLocation } from '@angular/common';

import { AbpModule } from '@abp/abp.module';
import { AbpHttpInterceptor } from '@abp/abpHttpInterceptor';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';

import { AppModule } from './app/app.module';
import { CommonModule } from '@shared/common/common.module';
import { ServiceProxyModule } from '@shared/service-proxies/service-proxy.module';
import { RootRoutingModule } from './root-routing.module';

import { AppConsts } from '@shared/AppConsts';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { API_BASE_URL } from '@shared/service-proxies/service-proxies';

import { RootComponent } from './root.component';
import { AppPreBootstrap } from './AppPreBootstrap';

import { UrlHelper } from '@shared/helpers/UrlHelper';
import { AppAuthService } from '@app/shared/common/auth/app-auth.service';
import { HttpClientModule } from '@angular/common/http';
import * as localForage from 'localforage';

import * as _ from 'lodash';
import { NZ_I18N, NZ_NOTIFICATION_CONFIG, zh_CN, en_US, NgZorroAntdModule, NzIconService } from 'ng-zorro-antd';
import { InstallModule } from './install/install.module';
import { CustomMessageService } from '@shared/common/message/custom-message.service';
import { CustomNotifyService } from '@shared/common/notify/custom-notify.service';
import { DelonModule } from './delon.module';
import { ACLService } from '@delon/acl';
import { MenuService } from '@delon/theme';

export function appInitializerFactory(
    injector: Injector,
    platformLocation: PlatformLocation) {
    return () => {
        const zorroMessage = injector.get(CustomMessageService);
        zorroMessage.Init();

        const zorroNotify = injector.get(CustomNotifyService);
        zorroNotify.Init();

        handleLogoutRequest(injector.get(AppAuthService));

        return new Promise<boolean>((resolve, reject) => {
            AppConsts.appBaseHref = getBaseHref(platformLocation);
            let appBaseUrl = getDocumentOrigin() + AppConsts.appBaseHref;

            let bootstrap = new AppPreBootstrap(injector.get(HttpClient), injector.get(ACLService),
                injector.get(MenuService), injector.get(NzIconService));

            bootstrap.run(appBaseUrl, () => {
                // Initialize local Forage
                localForage.config({
                    driver: localForage.LOCALSTORAGE,
                    name: 'IOCC',
                    version: 1.0,
                    storeName: 'IOCC_local_storage',
                    description: 'Cached data for IOCC'
                });

                let appSessionService: AppSessionService = injector.get(AppSessionService);

                // 关闭G2 发送usage信息
                if (typeof G2 !== 'undefined') {
                    G2.track(false);
                }

                appSessionService.init().then(
                    (result) => {

                        if (shouldLoadLocale()) {
                            let angularLocale = convertAbpLocaleToAngularLocale(abp.localization.currentLanguage.name);
                            System.import(`@angular/common/locales/${angularLocale}.js`)
                                .then(module => {
                                    registerLocaleData(module.default);
                                    resolve(result);
                                }, reject);
                        } else {
                            resolve(result);
                        }
                    },
                    (err) => {
                        reject(err);
                    }
                );
            }, resolve, reject);
        });
    };
}

function getDocumentOrigin() {
    if (!document.location.origin) {
        return document.location.protocol + '//' + document.location.hostname + (document.location.port ? ':' + document.location.port : '');
    }

    return document.location.origin;
}

export function shouldLoadLocale(): boolean {
    return abp.localization.currentLanguage.name && abp.localization.currentLanguage.name !== 'en-US';
}

export function convertAbpLocaleToAngularLocale(locale: string): string {
    if (!AppConsts.localeMappings) {
        return locale;
    }

    let localeMapings = _.filter(AppConsts.localeMappings, {from: locale});
    if (localeMapings && localeMapings.length) {
        return localeMapings[0]['to'];
    }

    return locale;
}

export function getRemoteServiceBaseUrl(): string {
    return AppConsts.remoteServiceBaseUrl;
}

export function getCurrentLanguage(): string {
    return abp.localization.currentLanguage.name;
}

export function GetNgZorroLanguage(): any {
    let langName = abp.localization.currentLanguage.name;

    switch (langName) {
        case 'zh':
        case 'zh-CN':
        case 'zh-Hans':
            return zh_CN;
        case 'en':
        case 'en-US':
            return en_US;
        default:
            return zh_CN;
    }

}

export function getBaseHref(platformLocation: PlatformLocation): string {
    return platformLocation.getBaseHrefFromDOM();
}

function handleLogoutRequest(authService: AppAuthService) {
    let currentUrl = UrlHelper.initialUrl;
    let returnUrl = UrlHelper.getReturnUrl();
    if (currentUrl.indexOf(('account/logout')) >= 0 && returnUrl) {
        authService.logout(true, returnUrl);
    }
}

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppModule,
        CommonModule.forRoot(),
        AbpModule,
        ServiceProxyModule,
        HttpClientModule,
        RootRoutingModule,
        InstallModule,
        NgZorroAntdModule.forRoot(),
        // 引入DelonMdule
        DelonModule.forRoot(),
    ],
    declarations: [
        RootComponent
    ],
    providers: [
        {provide: HTTP_INTERCEPTORS, useClass: AbpHttpInterceptor, multi: true},
        {provide: API_BASE_URL, useFactory: getRemoteServiceBaseUrl},
        {
            provide: APP_INITIALIZER,
            useFactory: appInitializerFactory,
            deps: [Injector, PlatformLocation],
            multi: true
        },
        {
            provide: LOCALE_ID,
            useFactory: getCurrentLanguage
        },
        {provide: NZ_NOTIFICATION_CONFIG, useValue: {nzPlacement: 'bottomRight'}},
        {provide: NZ_I18N, useValue: zh_CN},
    ],
    bootstrap: [RootComponent]
})
export class RootModule {

}
