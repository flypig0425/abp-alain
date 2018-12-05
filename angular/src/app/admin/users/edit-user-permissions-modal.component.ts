import { Component, ViewChild, Injector, Input, AfterViewInit } from '@angular/core';
import {
    UserServiceProxy,
    UpdateUserPermissionsInput,
    EntityDtoOfInt64
} from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { PermissionTreeComponent } from '../shared/permission-tree.component';
import { NzModalRef } from 'ng-zorro-antd';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'editUserPermissionsModal',
    templateUrl: './edit-user-permissions-modal.component.html'
})
export class EditUserPermissionsModalComponent extends AppComponentBase implements AfterViewInit {

    @ViewChild('permissionTree') permissionTree: PermissionTreeComponent;

    @Input() userId: number;
    @Input() userName: string;

    saving = false;
    resettingPermissions = false;

    constructor(
        injector: Injector,
        private _userService: UserServiceProxy,
        private modal: NzModalRef
    ) {
        super(injector);
    }

    ngAfterViewInit(): void {
        this._userService.getUserPermissionsForEdit(this.userId).subscribe(result => {
            this.permissionTree.editData = result;
        });
    }

    save(): void {
        let input = new UpdateUserPermissionsInput();

        input.id = this.userId;
        input.grantedPermissionNames = this.permissionTree.getGrantedPermissionNames();

        this.saving = true;
        this._userService.updateUserPermissions(input)
            .pipe(finalize(() => {
                this.saving = false;
            }))
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
            });
    }

    resetPermissions(): void {

        let input = new EntityDtoOfInt64();

        input.id = this.userId;

        this.resettingPermissions = true;
        this._userService.resetUserSpecificPermissions(input).subscribe(() => {
            this.notify.info(this.l('ResetSuccessfully'));
            this._userService.getUserPermissionsForEdit(this.userId).subscribe(result => {
                this.permissionTree.editData = result;
            });
        }, undefined, () => {
            this.resettingPermissions = false;
        });
    }

    close(): void {
        this.modal.destroy();
    }


}
