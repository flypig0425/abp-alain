import { NgModule } from '@angular/core';

import { InstallComponent } from './install.component';
import { FormsModule } from '@angular/forms';
import * as ngCommon from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { ServiceProxyModule } from '@shared/service-proxies/service-proxy.module';

@NgModule({
    imports: [
        ngCommon.CommonModule,
        FormsModule,
        ServiceProxyModule,
        NgZorroAntdModule.forRoot(),
    ],
    exports: [
        InstallComponent
    ],
    declarations: [InstallComponent],
    providers: [],
})
export class InstallModule {
}
