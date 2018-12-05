import {
    Component,
    ViewChild,
    Injector,
} from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { PermissionTreeEditModel } from '@app/admin/shared/permission-tree-edit.model';
import { NzTreeComponent, NzTreeNode } from 'ng-zorro-antd';
import { ArrayService } from '@delon/util';

@Component({
    selector: 'permission-tree',
    template:
            `
        <nz-tree #nzTree [nzData]="nodes" [nzCheckable]="true" [nzCheckStrictly]="true"
                 [nzCheckedKeys]="checkedKeys" [nzExpandAll]="true">

        </nz-tree>
    `
})
export class PermissionTreeComponent extends AppComponentBase {

    set editData(val: PermissionTreeEditModel) {
        this._editData = val;
        this.refreshTree();
    }

    private _editData: PermissionTreeEditModel;

    nodes: any[] = [];
    checkedKeys: string[] = [];

    constructor(
        injector: Injector,
        private arrayService: ArrayService,
    ) {
        super(injector);
    }

    getGrantedPermissionNames(): string[] {
        return this.arrayService.getKeysByTreeNode(this.nodes, {
            includeHalfChecked: false
        });
    }

    refreshTree(): void {
        this.nodes = this.arrayService.arrToTreeNode(this._editData.permissions, {
            idMapName: 'name',
            parentIdMapName: 'parentName',
            titleMapName: 'displayName',
        });

        this.checkedKeys = this._editData.grantedPermissionNames;
    }
}
