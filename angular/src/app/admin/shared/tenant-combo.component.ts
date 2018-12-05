import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { TenantListDto, TenantServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    selector: 'tenant-combo',
    template: `
        <nz-select nzShowSearch nzAllowClear nzPlaceHolder="租户列表" [(ngModel)]="selectedTenant"
                   (ngModelChange)="selectedTenantChange.emit($event)">
            <nz-option *ngFor="let tenant of tenants" [nzLabel]="tenant.tenancyName" [nzValue]="tenant.id"></nz-option>
        </nz-select>
    `
})

export class TenantComboComponent extends AppComponentBase implements OnInit {
    tenants: TenantListDto[];

    @Input() selectedTenant: number;
    @Output() selectedTenantChange: EventEmitter<number> = new EventEmitter<number>();


    constructor(injector: Injector,
                private _tenantService: TenantServiceProxy) {
        super(injector);
    }

    ngOnInit() {
        const self = this;
        this._tenantService.getTenants('',
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            false,
            undefined,
            50,
            0).subscribe(result => {
            this.tenants = result.items;
        });
    }
}
