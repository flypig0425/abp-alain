import { Component, ElementRef, Injector, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { OrganizationUnitDto } from '@shared/service-proxies/service-proxies';
import { NzTreeComponent, NzTreeNode } from 'ng-zorro-antd';

import * as _ from 'lodash';
import { ArrayService } from '@delon/util';

export interface IOrganizationUnitsTreeComponentData {
    allOrganizationUnits: OrganizationUnitDto[];
    selectedOrganizationUnits: string[];
}

@Component({
    selector: 'organization-unit-tree',
    template:
            `
        <nz-input-group [nzSuffix]="suffixIcon">
            <input type="text" nz-input placeholder="Search Tree Node" [(ngModel)]="searchValue">
        </nz-input-group>
        <ng-template #suffixIcon>
            <i class="anticon anticon-search"></i>
        </ng-template>
        <nz-tree #nzTree [(ngModel)]="nodes" [nzSearchValue]="searchValue" [nzCheckable]="true"
                 [nzCheckStrictly]="true"
                 [nzMultiple]="true" [nzDefaultExpandAll]="true">

        </nz-tree>
    `
})
export class OrganizationUnitsTreeComponent extends AppComponentBase {
    @ViewChild('nzTree') nzTree: NzTreeComponent;

    set data(data: IOrganizationUnitsTreeComponentData) {
        this._allOrganizationUnits = data.allOrganizationUnits;
        this.selectedOrganizationUnits = data.selectedOrganizationUnits;
        this.refreshTree();
    }

    searchValue;
    nodes: NzTreeNode[];

    private _allOrganizationUnits: OrganizationUnitDto[];
    selectedOrganizationUnits: string[];

    private filter = '';

    constructor(private _element: ElementRef,
                injector: Injector,
                private arrayService: ArrayService,
    ) {
        super(injector);
    }

    getSelectedOrganizations(): number[] {
        let results = this.arrayService.getKeysByTreeNode(this.nodes)

        return results;
    }

    refreshTree(): void {
        let self = this;

        let temp = _.map(this._allOrganizationUnits, (item) => {
            return Object.assign({
                checked: _.includes(self.selectedOrganizationUnits, item.code)
            }, item);
        });

        this.nodes = this.arrayService.arrToTreeNode(temp, {
            idMapName: 'id',
            parentIdMapName: 'parentId',
            titleMapName: 'displayName',
            checkedMapname: 'checked'
        });


    }

}
