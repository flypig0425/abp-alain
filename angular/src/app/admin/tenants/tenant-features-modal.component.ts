import { Component, ViewChild, Injector, AfterViewInit } from '@angular/core';
import { TenantServiceProxy, UpdateTenantFeaturesInput, TenantEditDto, EntityDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { FeatureTreeComponent } from '../shared/feature-tree.component';

import { NzModalRef } from 'ng-zorro-antd';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'tenantFeaturesModal',
    templateUrl: './tenant-features-modal.component.html'
})
export class TenantFeaturesModalComponent extends AppComponentBase implements AfterViewInit {

    @ViewChild('featureTree') featureTree: FeatureTreeComponent;

    saving = false;

    resettingFeatures = false;
    tenantId: number;
    tenantName: string;
    featureEditData: any = null;

    constructor(
        injector: Injector,
        private _tenantService: TenantServiceProxy,
        private modal: NzModalRef,
    ) {
        super(injector);
    }

    ngAfterViewInit(): void {
        this.show();
    }

    show(): void {
        this.loadFeatures();
    }

    loadFeatures(): void {
        const self = this;
        self._tenantService.getTenantFeaturesForEdit(this.tenantId).subscribe((result) => {
            self.featureTree.editData = result;
        });
    }

    save(): void {
        if (!this.featureTree.areAllValuesValid()) {
            this.message.warn(this.l('InvalidFeaturesWarning'));
            return;
        }

        const input = new UpdateTenantFeaturesInput();
        input.id = this.tenantId;
        input.featureValues = this.featureTree.getGrantedFeatures();

        this.saving = true;
        this._tenantService.updateTenantFeatures(input)
            .pipe(finalize(() => this.saving = false))
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.modal.close(true);
            });
    }

    resetFeatures(): void {
        const input = new EntityDto();
        input.id = this.tenantId;

        this.resettingFeatures = true;
        this._tenantService.resetTenantSpecificFeatures(input)
            .pipe(finalize(() => this.saving = false))
            .subscribe(() => {
                this.notify.info(this.l('ResetSuccessfully'));
                this.loadFeatures();
            });
    }

    close(): void {
        this.modal.destroy();
    }

}
