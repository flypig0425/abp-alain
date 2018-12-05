import * as ngCommon from '@angular/common';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// import { HeaderSearchComponent } from './default/header/components/search.component';

import { HeaderIconComponent } from './default/header/components/icon.component';
import { HeaderFullScreenComponent } from './default/header/components/fullscreen.component';
import { HeaderI18nComponent } from './default/header/components/i18n.component';
import { HeaderStorageComponent } from './default/header/components/storage.component';
import { HeaderUserComponent } from './default/header/components/user.component';
import { SideBarNavComponent } from '@app/shared/layout/default/sidebar/sidebar-nav.component';
import { ChangePasswordModalComponent } from '@app/shared/layout/profile/change-password-modal.component';
import { FormsModule } from '@angular/forms';
import { UtilsModule } from '@shared/utils/utils.module';
import { MySettingsModalComponent } from '@app/shared/layout/profile/my-settings-modal.component';
import { AppCommonModule } from '@app/shared/common/app-common.module';
import { LoginAttemptsModalComponent } from '@app/shared/layout/login-attempts-modal.component';
import { LinkAccountModalComponent } from '@app/shared/layout/link-account-modal.component';
import { LinkedAccountsModalComponent } from '@app/shared/layout/linked-accounts-modal.component';
import { NotificationSettingsModalComponent } from '@app/shared/layout/notifications/notification-settings-modal.component';
import { LayoutFullScreenComponent } from '@app/shared/layout/fullscreen/fullscreen.component';
import { HeaderNotificationsComponent } from '@app/shared/layout/notifications/header-notifications.component';
import { NotificationsComponent } from '@app/shared/layout/notifications/notifications.component';
import { HeaderComponent } from '@app/shared/layout/default/header/header.component';
import { SettingDrawerComponent } from '@app/shared/layout/setting-drawer/setting-drawer.component';
import { SettingDrawerItemComponent } from '@app/shared/layout/setting-drawer/setting-drawer-item.component';
import { SharedModule } from '@shared/shared.module';


const SETTINGDRAWER = [SettingDrawerComponent, SettingDrawerItemComponent];

const COMPONENTS = [
    HeaderComponent,
    SideBarNavComponent,
    LayoutFullScreenComponent,
    NotificationSettingsModalComponent,
    NotificationsComponent,
    ...SETTINGDRAWER,
];

const HEADERCOMPONENTS = [
    // HeaderSearchComponent,
    HeaderNotificationsComponent,

    HeaderIconComponent,
    HeaderFullScreenComponent,
    HeaderI18nComponent,
    HeaderStorageComponent,
    HeaderUserComponent,

    ChangePasswordModalComponent,
    MySettingsModalComponent,
    LoginAttemptsModalComponent
];

@NgModule({
    imports: [
        ngCommon.CommonModule,
        AppCommonModule,
        CommonModule,
        FormsModule,
        RouterModule,
        UtilsModule,
        SharedModule
    ],
    providers: [],
    declarations: [
        ...COMPONENTS,
        ...HEADERCOMPONENTS,
    ],
    exports: [
        ...COMPONENTS
    ],
    entryComponents: [
        ChangePasswordModalComponent,
        MySettingsModalComponent,
        LoginAttemptsModalComponent,
        LinkAccountModalComponent,
        LinkedAccountsModalComponent,
        NotificationSettingsModalComponent,

        ...SETTINGDRAWER,
    ]
})
export class LayoutModule {
}
