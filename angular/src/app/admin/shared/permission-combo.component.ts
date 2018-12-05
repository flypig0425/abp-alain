import {
    Component,
    OnInit,
    AfterViewInit,
    ElementRef,
    ViewChild,
    Injector,
    Input,
    Output,
    EventEmitter
} from '@angular/core';
import { PermissionServiceProxy, FlatPermissionWithLevelDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';

import * as _ from 'lodash';

@Component({
    selector: 'permission-combo',
    template:
            `
        <nz-select nzShowSearch nzAllowClear nzPlaceHolder="{{l('FilterByPermission')}}"
                   [(ngModel)]="selectedPermission"
                   (ngModelChange)="selectedPermissionChange.emit($event)">
            <nz-option *ngFor="let permission of permissions" [nzLabel]="permission.displayName"
                       [nzValue]="permission.name">
            </nz-option>
        </nz-select>
    `
})
export class PermissionComboComponent extends AppComponentBase implements OnInit, AfterViewInit {

    permissions: FlatPermissionWithLevelDto[] = [];

    @Input() selectedPermission: string = undefined;
    @Output() selectedPermissionChange: EventEmitter<string> = new EventEmitter<string>();

    constructor(
        private _permissionService: PermissionServiceProxy,
        injector: Injector) {
        super(injector);
    }

    ngOnInit(): void {
        this._permissionService.getAllPermissions().subscribe(result => {
            _.forEach(result.items, item => {
                item.displayName = Array(item.level + 1).join('---') + ' ' + item.displayName;
            });

            this.permissions = result.items;
        });
    }

    ngAfterViewInit(): void {

    }
}
