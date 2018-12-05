import {Component, Injector, ViewChild, OnInit, ChangeDetectorRef, Output, EventEmitter} from '@angular/core';
import {AppComponentBase} from '@shared/common/app-component-base';
import {IBasicOrganizationUnitInfo} from './basic-organization-unit-info';
import {OrganizationUnitServiceProxy, OrganizationUnitUserListDto} from '@shared/service-proxies/service-proxies';
import {AddMemberModalComponent} from '@app/admin/organization-units/add-member-modal.component';
import {IUserWithOrganizationUnit} from './user-with-organization-unit';
import {IUsersWithOrganizationUnit} from './users-with-organization-unit';
import {PagedListingComponentBase, PagedRequestDto} from '@shared/common/PagedListingComponentBase';
import {CreateOrEditUnitModalComponent} from '@app/admin/organization-units/create-or-edit-unit-modal.component';
import {NzModalService} from 'ng-zorro-antd';
import { finalize } from 'rxjs/internal/operators';

@Component({
    selector: 'organization-unit-members',
    templateUrl: './organization-unit-members.component.html'
})
export class OrganizationUnitMembersComponent extends PagedListingComponentBase<OrganizationUnitUserListDto> implements OnInit {

    @Output() memberRemoved = new EventEmitter<IUserWithOrganizationUnit>();
    @Output() membersAdded = new EventEmitter<IUsersWithOrganizationUnit>();

    private _organizationUnit: IBasicOrganizationUnitInfo = null;

    dataItems: OrganizationUnitUserListDto[] = [];

    constructor(
        injector: Injector,
        private _changeDetector: ChangeDetectorRef,
        private _organizationUnitService: OrganizationUnitServiceProxy,
        private _nzModalService: NzModalService
    ) {
        super(injector);
    }

    ngOnInit(): void {
    }

    get organizationUnit(): IBasicOrganizationUnitInfo {
        return this._organizationUnit;
    }

    set organizationUnit(ou: IBasicOrganizationUnitInfo) {
        if (this._organizationUnit === ou) {
            return;
        }

        this._organizationUnit = ou;
        if (ou) {
            this.refresh();
        }
    }

    openAddModal(): void {
        let title = 'Select users';
        let modal = this._nzModalService.create({
            nzContent: AddMemberModalComponent,
            nzMaskClosable: false,
            nzComponentParams: {
                organizationUnitId: this._organizationUnit.id
            },
            nzTitle: title,
            nzFooter: null
        });

        modal.afterOpen.subscribe(() => {
            const instance = modal.getContentComponent();
            instance.membersAdded.subscribe((data) => {
                this.addMembers(data);
            });
        });
    }

    addMembers(data: any): void {
        this.membersAdded.emit({
            userIds: data.userIds,
            ouId: data.ouId
        });

        this.refresh();
    }

    protected delete(user: OrganizationUnitUserListDto): void {
        this.message.confirm(
            this.l('RemoveUserFromOuWarningMessage', user.userName, this.organizationUnit.displayName),
            isConfirmed => {
                if (isConfirmed) {
                    this._organizationUnitService
                        .removeUserFromOrganizationUnit(user.id, this.organizationUnit.id)
                        .subscribe(() => {
                            this.notify.success(this.l('SuccessfullyRemoved'));
                            this.memberRemoved.emit({
                                userId: user.id,
                                ouId: this.organizationUnit.id
                            });

                            this.refresh();
                        });
                }
            });
    }

    protected list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
        this._organizationUnitService.getOrganizationUnitUsers(
            this._organizationUnit.id,
            '',
            request.maxResultCount,
            request.skipCount
        ).pipe(finalize(() => {
            finishedCallback();
        })).subscribe(result => {
            this.dataItems = result.items;
            this.showPaging(result, pageNumber);
        });
    }
}
