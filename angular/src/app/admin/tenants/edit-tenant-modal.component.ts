///<reference path="../../../../node_modules/@angular/core/src/metadata/lifecycle_hooks.d.ts"/>
import { Component, ViewChild, Injector, Output, EventEmitter, ElementRef, OnInit } from '@angular/core';
import {
    TenantServiceProxy,
    CommonLookupServiceProxy,
    TenantEditDto,
    SubscribableEditionComboboxItemDto
} from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';

import * as moment from 'moment';
import * as _ from 'lodash';
import { NzModalRef } from 'ng-zorro-antd';
import { finalize } from 'rxjs/internal/operators';

@Component({
    selector: 'editTenantModal',
    templateUrl: './edit-tenant-modal.component.html',
    styleUrls: ['./edit-tenant-modal.component.less']
})
export class EditTenantModalComponent extends AppComponentBase implements OnInit {

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    tenantId: number;
    saving = false;
    isUnlimited = false;
    subscriptionEndDateUtcIsValid = false;

    tenant: TenantEditDto = undefined;
    currentConnectionString: string;
    editions: SubscribableEditionComboboxItemDto[] = [];
    isSubscriptionFieldsVisible = false;
    date: Date = null; // new Date();

    constructor(
        injector: Injector,
        private _tenantService: TenantServiceProxy,
        private _commonLookupService: CommonLookupServiceProxy,
        private _modal: NzModalRef
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.show(this.tenantId);
    }

    show(tenantId: number): void {
        this._commonLookupService.getEditionsForCombobox(false).subscribe(editionsResult => {
            this.editions = editionsResult.items;
            let notSelectedEdition = new SubscribableEditionComboboxItemDto();
            notSelectedEdition.displayText = this.l('NotAssigned');
            notSelectedEdition.value = '0';
            this.editions.unshift(notSelectedEdition);

            this._tenantService.getTenantForEdit(tenantId).subscribe((tenantResult) => {
                this.tenant = tenantResult;
                this.currentConnectionString = tenantResult.connectionString;
                this.tenant.editionId = this.tenant.editionId || 0;
                this.isUnlimited = !this.tenant.subscriptionEndDateUtc;
                this.subscriptionEndDateUtcIsValid = this.isUnlimited || this.tenant.subscriptionEndDateUtc !== undefined;
                this.toggleSubscriptionFields();

                if (this.tenant.subscriptionEndDateUtc) {
                    this.date = this.tenant.subscriptionEndDateUtc.toDate();
                }

            });
        });
    }

    formatSubscriptionEndDate(date: any): string {
        if (this.isUnlimited) {
            return '';
        }

        if (!this.tenant.editionId) {
            return '';
        }

        if (!date) {
            return '';
        }

        return moment(date).format('L');
    }

    selectedEditionIsFree(): boolean {
        if (!this.tenant.editionId) {
            return true;
        }

        let selectedEditions = _.filter(this.editions, {value: this.tenant.editionId + ''});
        if (selectedEditions.length !== 1) {
            return true;
        }

        let selectedEdition = selectedEditions[0];
        return selectedEdition.isFree;
    }

    save(): void {
        this.saving = true;
        if (this.tenant.editionId === 0) {
            this.tenant.editionId = null;
        }

        //take selected date as UTC
        if (!this.isUnlimited && this.tenant.editionId) {
            this.tenant.subscriptionEndDateUtc = moment(this.date);
        } else {
            this.tenant.subscriptionEndDateUtc = null;
        }

        this._tenantService.updateTenant(this.tenant)
            .pipe(finalize(() => {this.saving = false;}))
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this._modal.close(true);
            });
    }

    close(): void {
        this._modal.destroy();
    }

    onEditionChange(): void {
        if (this.selectedEditionIsFree()) {
            this.tenant.isInTrialPeriod = false;
        }

        this.toggleSubscriptionFields();
    }

    onDateChange(result: Date): void  {
        if (!result) {
            this.subscriptionEndDateUtcIsValid = false;
        }else {
            this.subscriptionEndDateUtcIsValid = true;
        }
    }

    onUnlimitedChange(): void {
        if (this.isUnlimited) {
            this.tenant.subscriptionEndDateUtc = null;
            this.subscriptionEndDateUtcIsValid = true;
        } else {
            if (!this.date) {
                this.subscriptionEndDateUtcIsValid = false;
            }
        }
    }

    toggleSubscriptionFields() {
        if (this.tenant.editionId > 0) {
            this.isSubscriptionFieldsVisible = true;
        } else {
            this.isSubscriptionFieldsVisible = false;
        }
    }
}
