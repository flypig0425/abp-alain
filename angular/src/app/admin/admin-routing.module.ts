import { NgModule } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { RolesComponent } from './roles/roles.component';
import { AuditLogsComponent } from './audit-logs/audit-logs.component';
import { HostSettingsComponent } from './settings/host-settings.component';
import { TenantSettingsComponent } from './settings/tenant-settings.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { EditionsComponent } from './editions/editions.component';
import { LanguagesComponent } from './languages/languages.component';
import { TenantsComponent } from './tenants/tenants.component';
import { OrganizationUnitsComponent } from './organization-units/organization-units.component';
import { HostDashboardComponent } from './dashboard/host-dashboard.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                children: [
                    {path: 'users', component: UsersComponent, data: {permission: 'Pages.Administration.Users'}},
                    {path: 'roles', component: RolesComponent, data: {permission: 'Pages.Administration.Roles'}},
                    {
                        path: 'auditLogs',
                        component: AuditLogsComponent,
                        data: {permission: 'Pages.Administration.AuditLogs'}
                    },
                    {
                        path: 'maintenance',
                        component: MaintenanceComponent,
                        data: {permission: 'Pages.Administration.Host.Maintenance'}
                    },
                    {
                        path: 'hostSettings',
                        component: HostSettingsComponent,
                        data: {permission: 'Pages.Administration.Host.Settings'}
                    },
                    {path: 'editions', component: EditionsComponent, data: {permission: 'Pages.Editions'}},
                    {
                        path: 'languages',
                        component: LanguagesComponent,
                        data: {permission: 'Pages.Administration.Languages'}
                    },
                    {path: 'tenants', component: TenantsComponent, data: {permission: 'Pages.Tenants'}},
                    {
                        path: 'organization-units',
                        component: OrganizationUnitsComponent,
                        data: {permission: 'Pages.Administration.OrganizationUnits'}
                    },
                    {
                        path: 'tenantSettings',
                        component: TenantSettingsComponent,
                        data: {permission: 'Pages.Administration.Tenant.Settings'}
                    },
                    {
                        path: 'hostDashboard',
                        component: HostDashboardComponent,
                        data: {permission: 'Pages.Administration.Host.Dashboard'}
                    },
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class AdminRoutingModule {

    constructor(
        private router: Router
    ) {
    }
}
