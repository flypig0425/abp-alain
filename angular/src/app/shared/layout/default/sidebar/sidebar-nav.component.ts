import { Component, Injector, OnInit, ViewEncapsulation } from '@angular/core';

import { AppComponentBase } from '@shared/common/app-component-base';
import { AppSessionService } from '@shared/common/session/app-session.service';

@Component({
    templateUrl: './sidebar-nav.component.html',
    selector: 'layout-sidebar'
})
export class SideBarNavComponent extends AppComponentBase implements OnInit {


    constructor(
        injector: Injector,
        private _appSessionService: AppSessionService
    ) {
        super(injector);

    }

    ngOnInit() {

    }
}
