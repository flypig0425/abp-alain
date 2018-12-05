///<reference path="../../../shared/common/PagedListingComponentBase.ts"/>
import { Component, Injector, ViewEncapsulation, ViewChild } from '@angular/core';
import { RoleServiceProxy, RoleListDto } from '@shared/service-proxies/service-proxies';
import { NotifyService } from '@abp/notify/notify.service';
import { CreateOrEditRoleModalComponent } from './create-or-edit-role-modal.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/common/PagedListingComponentBase';
import { finalize } from 'rxjs/operators';
import { ModalHelper } from '@delon/theme';

@Component({
    templateUrl: './roles.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class RolesComponent extends PagedListingComponentBase<RoleListDto> {

    //Filters
    selectedPermission = '';
    dataItems: RoleListDto[] = [];

    constructor(
        injector: Injector,
        private _roleService: RoleServiceProxy,
        private _notifyService: NotifyService,
        private _modalHelper: ModalHelper
    ) {
        super(injector);
    }

    protected list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
        let permission = this.permission ? this.selectedPermission : undefined;

        this._roleService.getRoles(permission)
            .pipe(finalize(() => {
                finishedCallback();
            }))
            .subscribe(result => {
                this.dataItems = result.items;
                // this.showPaging( result, pageNumber);
            });
    }

    protected delete(role: RoleListDto): void {
        let self = this;
        self.message.confirm(
            self.l('RoleDeleteWarningMessage', role.displayName),
            isConfirmed => {
                if (isConfirmed) {
                    this._roleService.deleteRole(role.id).subscribe(() => {
                        this.refresh();
                        abp.notify.success(this.l('SuccessfullyDeleted'));
                    });
                }
            }
        );
    }

    createRole(): void {
        let title = this.l('CreateNewRole');

        this._modalHelper.createStatic(CreateOrEditRoleModalComponent, {}, {
            modalOptions: {
                nzTitle: title
            }
        }).subscribe(() => {
            this.refresh();
        });
    }

    editRole(roleId?: number): void {
        let title = this.l('EditRole');

        this._modalHelper.createStatic(CreateOrEditRoleModalComponent, {
            roleId: roleId
        }, {
            modalOptions: {
                nzTitle: title
            }
        }).subscribe(() => {
            this.refresh();
        });
    }

    deleteRole(role: RoleListDto): void {
        let self = this;
        self.message.confirm(
            self.l('RoleDeleteWarningMessage', role.displayName),
            isConfirmed => {
                if (isConfirmed) {
                    this._roleService.deleteRole(role.id).subscribe(() => {
                        this.refresh();
                        abp.notify.success(this.l('SuccessfullyDeleted'));
                    });
                }
            }
        );
    }


}
