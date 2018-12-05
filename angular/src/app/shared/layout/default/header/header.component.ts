import { Component, Injector, OnInit, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppConsts } from '@shared/AppConsts';
import { SettingsService } from '@delon/theme';

@Component({
    templateUrl: './header.component.html',
    selector: 'layout-header',
    encapsulation: ViewEncapsulation.None
})
export class HeaderComponent extends AppComponentBase {
    defaultLogo = AppConsts.appBaseUrl + '/assets/common/images/app-logo-on-light.svg';

    remoteServiceBaseUrl: string = AppConsts.remoteServiceBaseUrl;

    searchToggleStatus: boolean;
    isCollapsed = false;

    constructor(
        injector: Injector,
        public settings: SettingsService
    ) {
        super(injector);
    }

    toggleCollapsedSidebar() {
        this.settings.setLayout('collapsed', !this.settings.layout.collapsed);
    }

    searchToggleChange() {
        this.searchToggleStatus = !this.searchToggleStatus;
    }
}
