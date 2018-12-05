import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AccountServiceProxy } from '@shared/service-proxies/service-proxies';
import { TenantChangeModalComponent } from './tenant-change-modal.component';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { NzModalService } from 'ng-zorro-antd';
import { AbpMultiTenancyService } from 'abp-ng2-module/dist/src/multi-tenancy/abp-multi-tenancy.service';

@Component({
    selector: 'tenant-change',
    template:
            `<span *ngIf="isMultiTenancyEnabled">
        {{l("CurrentTenant")}}: <span *ngIf="tenancyName" title="{{name}}"><strong>{{tenancyName}}</strong></span> <span
        *ngIf="!tenancyName">{{l("NotSelected")}}</span> (<a href="javascript:;"
                                                             (click)="showChangeModal()">{{l("Change")}}</a>)

    </span>`
})
export class TenantChangeComponent extends AppComponentBase implements OnInit {

    tenancyName: string;
    name: string;

    constructor(
        injector: Injector,
        private _appSessionService: AppSessionService,
        private _accountService: AccountServiceProxy,
        private _abpMultiTenancyService: AbpMultiTenancyService,
        private _nzModalService: NzModalService
    ) {
        super(injector);
    }

    ngOnInit() {
        if (this._appSessionService.tenant) {
            this.tenancyName = this._appSessionService.tenant.tenancyName;
            this.name = this._appSessionService.tenant.name;
        }
    }

    get isMultiTenancyEnabled(): boolean {
        return this._abpMultiTenancyService.isEnabled;
    }

    showChangeModal(): void {
        let title = this.l('ChangeTenant');

        let modal = this._nzModalService.create({
            nzContent: TenantChangeModalComponent,
            nzMaskClosable: false,
            nzComponentParams: {},
            nzTitle: title,
            nzFooter: null
        });
    }
}
