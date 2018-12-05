import { NgModule } from '@angular/core';
import { RouterModule, Router, NavigationEnd, RouteConfigLoadStart, RouteConfigLoadEnd } from '@angular/router';
import { NotificationsComponent } from './shared/layout/notifications/notifications.component';
import { AppComponent } from './app.component';
import { AppRouteGuard } from './shared/common/auth/auth-route-guard';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'app',
                component: AppComponent,
                canActivate: [AppRouteGuard],
                canActivateChild: [AppRouteGuard],
                children: [
                    {
                        path: '',
                        children: [
                            {
                                path: 'notifications', component: NotificationsComponent, data: {
                                    reuse: true
                                }
                            },
                            {path: '', redirectTo: '/dashboard', pathMatch: 'full'}
                        ]
                    },
                    {
                        path: 'main',
                        loadChildren: 'app/main/main.module#MainModule', //Lazy load main module
                        data: {preload: true}
                    },
                    {
                        path: 'admin',
                        loadChildren: 'app/admin/admin.module#AdminModule', //Lazy load admin module
                        data: {preload: true}
                    }, {
                        path: '**', redirectTo: 'notifications'
                    }
                ]
            },

        ])
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
