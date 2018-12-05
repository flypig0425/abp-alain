import {
    Component,
    ViewChild,
    Injector,
    Output,
    EventEmitter,
    ElementRef,
    Input,
    AfterViewInit, OnInit,
} from '@angular/core';
import {
    RoleServiceProxy,
    RoleEditDto,
    CreateOrUpdateRoleInput,
} from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { PermissionTreeComponent } from '../shared/permission-tree.component';

import { NzModalRef } from 'ng-zorro-antd';
import { finalize } from 'rxjs/internal/operators';

@Component({
    selector: 'createOrEditRoleModal',
    templateUrl: './create-or-edit-role-modal.component.html',
    styleUrls: ['./create-or-edit-role-modal.component.less']
})
export class CreateOrEditRoleModalComponent extends AppComponentBase implements OnInit {

    @ViewChild('permissionTree') permissionTree: PermissionTreeComponent;

    @Input() roleId: number;

    saving = false;

    role: RoleEditDto = new RoleEditDto();

    constructor(
        injector: Injector,
        private modal: NzModalRef,
        private _roleService: RoleServiceProxy
    ) {
        super(injector);
    }

    ngOnInit() {
        this.show(this.roleId);
    }

    show(roleId?: number): void {
        this._roleService.getRoleForEdit(roleId).subscribe(result => {
            this.role = result.role;
            this.permissionTree.editData = result;

        });
    }

    save(): void {
        const self = this;

        const input = new CreateOrUpdateRoleInput();
        input.role = self.role;
        input.grantedPermissionNames = self.permissionTree.getGrantedPermissionNames();

        this.saving = true;
        this._roleService.createOrUpdateRole(input)
            .pipe(finalize(() => {
                this.saving = false;
            }))
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.modal.close(true);
            });
    }

    close(): void {
        this.modal.destroy();
    }
}
