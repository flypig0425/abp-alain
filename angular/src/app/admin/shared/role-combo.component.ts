import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { RoleListDto, RoleServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    selector: 'role-combo',
    template:
        `<nz-select nzShowSearch nzAllowClear nzPlaceHolder="{{l('FilterByRole')}}" [(ngModel)]="selectedRole"
        (ngModelChange)="selectedRoleChange.emit($event)">
            <nz-option *ngFor="let role of roles" [nzLabel]="role.displayName" [nzValue]="role.id"></nz-option>
        </nz-select>`
})

export class RoleComboComponent extends AppComponentBase implements OnInit {
    roles: RoleListDto[] = [];

    @Input() selectedRole: string = undefined;
    @Output() selectedRoleChange: EventEmitter<string> = new EventEmitter<string>();

    constructor(injector: Injector,
                private _roleService: RoleServiceProxy) {
        super(injector);
    }

    ngOnInit() {
        const self = this;
        this._roleService.getRoles(undefined).subscribe(result => {
            this.roles = result.items;
        });
    }
}
