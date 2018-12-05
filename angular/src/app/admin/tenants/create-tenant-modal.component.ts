import { Component, ViewChild, Injector, Output, EventEmitter, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import {
    TenantServiceProxy,
    ProfileServiceProxy,
    CreateTenantInput,
    CommonLookupServiceProxy,
    PasswordComplexitySetting,
    SubscribableEditionComboboxItemDto
} from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';

import * as moment from 'moment';
import * as _ from 'lodash';
import { NzModalRef } from 'ng-zorro-antd';
import { finalize } from 'rxjs/internal/operators';

@Component({
    selector: 'createTenantModal',
    templateUrl: './create-tenant-modal.component.html',
    styleUrls: ['./create-tenant-modal.component.less']
})
export class CreateTenantModalComponent extends AppComponentBase implements OnInit {

    saving = false;
    setRandomPassword = true;
    useHostDb = true;
    editions: SubscribableEditionComboboxItemDto[] = [];
    tenant: CreateTenantInput;
    passwordComplexitySetting: PasswordComplexitySetting = new PasswordComplexitySetting();
    isUnlimited = false;
    isSubscriptionFieldsVisible = false;
    isSelectedEditionFree = false;
    date: Date = null; // new Date();

    constructor(
        injector: Injector,
        private _tenantService: TenantServiceProxy,
        private _commonLookupService: CommonLookupServiceProxy,
        private _profileService: ProfileServiceProxy,
        private _modal: NzModalRef,
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.show();
    }

    show() {
        this.init();

        this._profileService.getPasswordComplexitySetting().subscribe(result => {
            this.passwordComplexitySetting = result.setting;
        });
    }

    init(): void {
        this.tenant = new CreateTenantInput();
        this.tenant.isActive = true;
        this.tenant.shouldChangePasswordOnNextLogin = true;
        this.tenant.sendActivationEmail = true;
        this.tenant.editionId = 0;
        this.tenant.isInTrialPeriod = false;

        this._commonLookupService.getEditionsForCombobox(false)
            .subscribe((result) => {
                this.editions = result.items;
                // this.editions.unshift({
                //     value: 0,
                //     displayText: this.l('NotAssigned'),
                //     isFree: true,
                //     isSelected: false
                // });

                this._commonLookupService.getDefaultEditionName().subscribe((getDefaultEditionResult) => {
                    let defaultEdition = _.filter(this.editions, {'displayText': getDefaultEditionResult.name});
                    if (defaultEdition && defaultEdition[0]) {
                        this.tenant.editionId = parseInt(defaultEdition[0].value);
                        this.toggleSubscriptionFields();
                    }
                });
            });
    }

    getEditionValue(item): number {
        return parseInt(item.value);
    }

    selectedEditionIsFree(): boolean {
        let selectedEditions = _.filter(this.editions, {'value': this.tenant.editionId});
        if (selectedEditions.length !== 1) {
            this.isSelectedEditionFree = true;
        }

        let selectedEdition = selectedEditions[0];
        // this.isSelectedEditionFree = selectedEdition.isFree;
        return this.isSelectedEditionFree;
    }

    subscriptionEndDateIsValid(): boolean {
        if (this.tenant.editionId <= 0) {
            return true;
        }

        if (this.isUnlimited) {
            return true;
        }

        return this.date !== null;
    }

    save(): void {
        this.saving = true;

        if (this.setRandomPassword) {
            this.tenant.adminPassword = null;
        }

        if (this.tenant.editionId === 0) {
            this.tenant.editionId = null;
        }

        //take selected date as UTC
        if (!this.isUnlimited && this.tenant.editionId > 0) {
            this.tenant.subscriptionEndDateUtc = moment(this.date);
        } else {
            this.tenant.subscriptionEndDateUtc = null;
        }

        this._tenantService.createTenant(this.tenant)
            .pipe(finalize(() => this.saving = false))
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this._modal.close(true);
            });
    }

    close(): void {
        this._modal.destroy();
    }

    onEditionChange(): void {
        this.tenant.isInTrialPeriod = this.tenant.editionId > 0 && !this.selectedEditionIsFree();
        this.toggleSubscriptionFields();
    }

    toggleSubscriptionFields() {
        if (this.tenant.editionId > 0) {
            this.isSubscriptionFieldsVisible = true;
        } else {
            this.isSubscriptionFieldsVisible = false;
        }
    }


}
