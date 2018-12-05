import {Component, OnInit, Injector, Output, EventEmitter, AfterViewInit} from '@angular/core';
import {
    NameValueDto,
    UsersToOrganizationUnitInput,
    OrganizationUnitServiceProxy,
    FindOrganizationUnitUsersInput, FindUsersInput,

} from '@shared/service-proxies/service-proxies';
import {IUsersWithOrganizationUnit} from './users-with-organization-unit';
import * as _ from 'lodash';
import {PagedListingComponentBase, PagedRequestDto} from '@shared/common/PagedListingComponentBase';
import {NzModalRef} from 'ng-zorro-antd';
import {ActivatedRoute} from '@angular/router';

interface ICheckedNameValueDto {
    name? : string;
    value? : string;
    checked? : boolean;
}

@Component({
    selector: 'addMemberModal',
    templateUrl: './add-member-modal.component.html'
})
export class AddMemberModalComponent extends PagedListingComponentBase<NameValueDto>{

    organizationUnitId: number;

    @Output() membersAdded: EventEmitter<IUsersWithOrganizationUnit> = new EventEmitter<IUsersWithOrganizationUnit>();

    isShown = false;
    filterText = '';
    tenantId?: number;
    saving = false;
    saved = true;

    dataItems: ICheckedNameValueDto[] = [];

    allChecked = false;
    indeterminate = false;

    constructor(
        injector: Injector,
        private _organizationUnitService: OrganizationUnitServiceProxy,
        private _modal: NzModalRef,
        private _activatedRoute: ActivatedRoute,
    ) {
        super(injector);
    }

    refreshStatus(): void {
        const allChecked = this.dataItems.every(value => value.checked === true);
        const allUnChecked = this.dataItems.every(value => !value.checked);
        this.allChecked = allChecked;
        this.indeterminate = (!allChecked) && (!allUnChecked);
        const hasChecked = this.dataItems.find(value => value.checked === true);
        if(hasChecked != null)
        {
            this.saved = false;
        }
        else
        {
            this.saved = true;
        }
    }

    checkAll(value: boolean): void {
        this.dataItems.forEach(data => {
            data.checked = value;
        });
        this.refreshStatus();
    }


    close(): void {
        this._modal.destroy();
    }

    addUsersToOrganizationUnit(): void {
        const input = new UsersToOrganizationUnitInput();
        input.organizationUnitId = this.organizationUnitId;
        let selectedItems = this.dataItems.filter(value => value.checked === true);
        input.userIds = _.map(selectedItems,
            selectedMember => Number(selectedMember.value));
        this.saving = true;
        this._organizationUnitService
            .addUsersToOrganizationUnit(input)
            .subscribe(() => {
                this.notify.success(this.l('SuccessfullyAdded'));
                this.membersAdded.emit({
                    userIds: input.userIds,
                    ouId: input.organizationUnitId
                });
                this.saving = false;
                this.close();
            });
    }

    protected delete(entity: NameValueDto): void {
    }

    protected list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
        const input = new FindOrganizationUnitUsersInput();
        input.organizationUnitId = this.organizationUnitId;
        input.filter = this.filterText;
        input.skipCount = request.skipCount;
        input.maxResultCount = request.maxResultCount;

        this._organizationUnitService
            .findUsers(input)
            .subscribe(result => {
                this.dataItems = _.map(result.items, item => {
                    return {
                        name: item.name,
                        value: item.value,
                        checked: false,
                    };
                });
                finishedCallback();
                this.showPaging(result, pageNumber);
            });
    }


}
