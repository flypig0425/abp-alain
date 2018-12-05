import {Component, ViewChild, Injector, Output, EventEmitter, ElementRef, ChangeDetectorRef} from '@angular/core';
import {
    OrganizationUnitServiceProxy,
    CreateOrganizationUnitInput,
    UpdateOrganizationUnitInput,
    OrganizationUnitDto
} from '@shared/service-proxies/service-proxies';
import {AppComponentBase} from '@shared/common/app-component-base';

import {NzModalRef, NzModalService} from 'ng-zorro-antd';
import { finalize } from 'rxjs/operators';

export interface IOrganizationUnitOnEdit {
    id?: number;
    parentId?: number;
    displayName?: string;
}

@Component({
    selector: 'createOrEditOrganizationUnitModal',
    templateUrl: './create-or-edit-unit-modal.component.html'
})
export class CreateOrEditUnitModalComponent extends AppComponentBase {

    @ViewChild('organizationUnitDisplayName') organizationUnitDisplayNameInput: ElementRef;

    @Output() unitCreated: EventEmitter<OrganizationUnitDto> = new EventEmitter<OrganizationUnitDto>();
    @Output() unitUpdated: EventEmitter<OrganizationUnitDto> = new EventEmitter<OrganizationUnitDto>();
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    saving = false;

    organizationUnit: IOrganizationUnitOnEdit = {};

    constructor(
        injector: Injector,
        private _organizationUnitService: OrganizationUnitServiceProxy,
        private _changeDetector: ChangeDetectorRef,
        private _modal: NzModalRef,
    ) {
        super(injector);
    }

    onShown(): void {
        $(this.organizationUnitDisplayNameInput.nativeElement).focus();
    }

    show(organizationUnit: IOrganizationUnitOnEdit): void {
        this.organizationUnit = organizationUnit;
        this._changeDetector.detectChanges();
    }

    save(): void {
        if (!this.organizationUnit.id) {
            this.createUnit();
        } else {
            this.updateUnit();
        }
    }

    createUnit() {
        const createInput = new CreateOrganizationUnitInput();
        createInput.parentId = this.organizationUnit.parentId;
        createInput.displayName = this.organizationUnit.displayName;

        this.saving = true;
        this._organizationUnitService
            .createOrganizationUnit(createInput)
            .pipe(finalize(() => this.saving = false))
            .subscribe((result: OrganizationUnitDto) => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.unitCreated.emit(result);
            });
    }

    updateUnit() {
        const updateInput = new UpdateOrganizationUnitInput();
        updateInput.id = this.organizationUnit.id;
        updateInput.displayName = this.organizationUnit.displayName;

        this.saving = true;
        this._organizationUnitService
            .updateOrganizationUnit(updateInput)
            .pipe(finalize(() => this.saving = false))
            .subscribe((result: OrganizationUnitDto) => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.unitUpdated.emit(result);
            });
    }

    close(): void {
        this._modal.destroy();
    }
}
