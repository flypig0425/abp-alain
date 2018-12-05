import { Component, ViewContainerRef, OnInit, Injector, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './login/login.service';
import { AppConsts } from '@shared/AppConsts';
import { AppComponentBase } from '@shared/common/app-component-base';

import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
    templateUrl: './account.component.html',
    styleUrls: [
        './account.component.less'
    ]
})
export class AccountComponent extends AppComponentBase implements OnInit {

    links = [
        {
            title: '帮助',
            href: '',
        },
        {
            title: '隐私',
            href: '',
        },
        {
            title: '条款',
            href: '',
        },
    ];

    releaseDate: string;

    private viewContainerRef: ViewContainerRef;

    currentYear: number = moment().year();
    remoteServiceBaseUrl: string = AppConsts.remoteServiceBaseUrl;
    tenantChangeDisabledRoutes: string[] = ['select-edition', 'buy', 'upgrade', 'extend', 'register-tenant'];

    public constructor(
        injector: Injector,
        private _router: Router,
        private _loginService: LoginService,
        viewContainerRef: ViewContainerRef
    ) {
        super(injector);

        // We need this small hack in order to catch application root view container ref for modals
        this.viewContainerRef = viewContainerRef;
    }

    showTenantChange(): boolean {
        if (!this._router.url) {
            return false;
        }

        if (_.filter(this.tenantChangeDisabledRoutes, route => this._router.url.indexOf('/account/' + route) >= 0).length) {
            return false;
        }

        return abp.multiTenancy.isEnabled && !this.supportsTenancyNameInUrl();
    }

    useFullWidthLayout(): boolean {
        return this._router.url.indexOf('/account/select-edition') >= 0;
    }

    ngOnInit(): void {
        this._loginService.init();

        this.releaseDate = this.appSession.application.releaseDate.format('YYYYMMDD');
    }

    goToHome(): void {
        (window as any).location.href = '/';
    }

    private supportsTenancyNameInUrl() {
        return (AppConsts.appBaseUrlFormat && AppConsts.appBaseUrlFormat.indexOf(AppConsts.tenancyNamePlaceHolderInUrl) >= 0);
    }
}
