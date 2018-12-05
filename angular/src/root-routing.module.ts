import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router, NavigationEnd } from '@angular/router';
import { InstallComponent } from './install/install.component';

const routes: Routes = [
    {path: '', redirectTo: '/app/main/dashboard', pathMatch: 'full'},
    {
        path: 'account',
        loadChildren: 'account/account.module#AccountModule', //Lazy load account module
        data: {preload: true}
    },
    // 单页布局，不需要layout
    {
        path: 'install',
        component: InstallComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [RouterModule],
    providers: []
})
export class RootRoutingModule {
    constructor(
        private router: Router) {
        router.events.subscribe((event: NavigationEnd) => {
            setTimeout(() => {
            }, 0);
        });
    }

    getSetting(key: string): string {
        return abp.setting.get(key);
    }
}
