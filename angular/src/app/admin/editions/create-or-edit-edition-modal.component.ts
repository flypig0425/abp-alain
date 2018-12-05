///<reference path="../../../../node_modules/@angular/core/src/metadata/lifecycle_hooks.d.ts"/>
import {
    Component,
    ViewChild,
    Injector,
    Output,
    EventEmitter,
    OnInit
} from '@angular/core';
import { EditionServiceProxy, CommonLookupServiceProxy, EditionEditDto, CreateOrUpdateEditionDto, ComboboxItemDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { FeatureTreeComponent } from '../shared/feature-tree.component';
import { AppEditionExpireAction } from '@shared/AppEnums';

import { NzModalRef } from 'ng-zorro-antd';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'createOrEditEditionModal',
    templateUrl: './create-or-edit-edition-modal.component.html',
    styleUrls: ['../../shared/ant-form-item.less']
})
export class CreateOrEditEditionModalComponent extends AppComponentBase implements OnInit {

    @ViewChild('featureTree') featureTree: FeatureTreeComponent;


    saving = false;

    editionId?: number;
    edition: EditionEditDto = new EditionEditDto();
    expiringEditions: ComboboxItemDto[] = [];

    expireAction: AppEditionExpireAction = AppEditionExpireAction.DeactiveTenant;
    expireActionEnum: typeof AppEditionExpireAction = AppEditionExpireAction;
    isFree = 'true';
    isTrialActive = false;
    isWaitingDayActive = false;

    constructor(
        injector: Injector,
        private _editionService: EditionServiceProxy,
        private _commonLookupService: CommonLookupServiceProxy,
        private _modal: NzModalRef,
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.show(this.editionId);
    }

    show(editionId?: number): void {

        this._commonLookupService.getEditionsForCombobox(true).subscribe(editionsResult => {
            this.expiringEditions = editionsResult.items;
            this.expiringEditions.unshift(new ComboboxItemDto({ value: null, displayText: this.l('NotAssigned'), isSelected: true }));

            this._editionService.getEditionForEdit(editionId).subscribe(editionResult => {
                this.edition = editionResult.edition;
                this.featureTree.editData = editionResult;

                this.expireAction = this.edition.expiringEditionId > 0 ? AppEditionExpireAction.AssignToAnotherEdition : AppEditionExpireAction.DeactiveTenant;

                this.isFree = (!editionResult.edition.monthlyPrice && !editionResult.edition.annualPrice) ? 'true' : 'false';
                this.isTrialActive = editionResult.edition.trialDayCount > 0;
                this.isWaitingDayActive = editionResult.edition.waitingDayAfterExpire > 0;

            });
        });
    }

    updateAnnualPrice(value): void {
        this.edition.annualPrice = value;
    }

    updateMonthlyPrice(value): void {
        this.edition.monthlyPrice = value;
    }

    resetPrices(isFree) {
        this.edition.annualPrice = undefined;
        this.edition.monthlyPrice = undefined;
    }

    removeExpiringEdition(isDeactivateTenant) {
        this.edition.expiringEditionId = null;
    }

    save(): void {
        const input = new CreateOrUpdateEditionDto();
        input.edition = this.edition;
        input.featureValues = this.featureTree.getGrantedFeatures();

        this.saving = true;
        this._editionService.createOrUpdateEdition(input)
            .pipe(finalize(() => this.saving = false))
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this._modal.close(true);
            });
    }

    close(): void {
        this._modal.destroy();
    }


}
