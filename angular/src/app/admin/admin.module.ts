import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FileUploadModule } from 'ng2-file-upload';

import { AdminRoutingModule } from './admin-routing.module';
import { UtilsModule } from '@shared/utils/utils.module';
import { AppCommonModule } from '@app/shared/common/app-common.module';

import { UsersComponent } from './users/users.component';
import { PermissionComboComponent } from './shared/permission-combo.component';
import { RoleComboComponent } from './shared/role-combo.component';
import { CreateOrEditUserModalComponent } from './users/create-or-edit-user-modal.component';
import { EditUserPermissionsModalComponent } from './users/edit-user-permissions-modal.component';
import { PermissionTreeComponent } from './shared/permission-tree.component';
import { FeatureTreeComponent } from './shared/feature-tree.component';
import { OrganizationUnitsTreeComponent } from './shared/organization-unit-tree.component';

import { RolesComponent } from './roles/roles.component';
import { CreateOrEditRoleModalComponent } from './roles/create-or-edit-role-modal.component';

import { AuditLogsComponent } from './audit-logs/audit-logs.component';
import { AuditLogDetailModalComponent } from './audit-logs/audit-log-detail-modal.component';

import { HostSettingsComponent } from './settings/host-settings.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { EditionsComponent } from './editions/editions.component';
import { CreateOrEditEditionModalComponent } from './editions/create-or-edit-edition-modal.component';
import { ImpersonationService } from './users/impersonation.service';
import { LanguagesComponent } from './languages/languages.component';
import { TenantsComponent } from './tenants/tenants.component';
import { CreateTenantModalComponent } from './tenants/create-tenant-modal.component';
import { EditTenantModalComponent } from './tenants/edit-tenant-modal.component';
import { TenantFeaturesModalComponent } from './tenants/tenant-features-modal.component';
import { OrganizationUnitsComponent } from './organization-units/organization-units.component';
import { OrganizationTreeComponent } from './organization-units/organization-tree.component';
import { OrganizationUnitMembersComponent } from './organization-units/organization-unit-members.component';
import { CreateOrEditUnitModalComponent } from './organization-units/create-or-edit-unit-modal.component';
import { TenantSettingsComponent } from './settings/tenant-settings.component';
import { HostDashboardComponent } from './dashboard/host-dashboard.component';
import { EditionComboComponent } from './shared/edition-combo.component';
import { AddMemberModalComponent } from 'app/admin/organization-units/add-member-modal.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { TenantComboComponent } from '@app/admin/shared/tenant-combo.component';
import { DelonModule } from '../../delon.module';
import { DelonABCModule } from '@delon/abc';
import { DelonUtilModule } from '@delon/util';
import { AlainThemeModule } from '@delon/theme';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        FileUploadModule,
        AdminRoutingModule,
        UtilsModule,
        AppCommonModule,
        NgZorroAntdModule.forRoot(),
        DelonABCModule,
        DelonUtilModule,
        AlainThemeModule,
        DelonModule.forRoot(),
    ],
    declarations: [
        UsersComponent,
        PermissionComboComponent,
        RoleComboComponent,
        CreateOrEditUserModalComponent,
        EditUserPermissionsModalComponent,
        PermissionTreeComponent,
        FeatureTreeComponent,
        OrganizationUnitsTreeComponent,
        RolesComponent,
        CreateOrEditRoleModalComponent,
        AuditLogsComponent,
        AuditLogDetailModalComponent,
        HostSettingsComponent,
        MaintenanceComponent,
        EditionsComponent,
        CreateOrEditEditionModalComponent,
        LanguagesComponent,
        TenantsComponent,
        CreateTenantModalComponent,
        EditTenantModalComponent,
        TenantFeaturesModalComponent,
        OrganizationUnitsComponent,
        OrganizationTreeComponent,
        OrganizationUnitMembersComponent,
        CreateOrEditUnitModalComponent,
        TenantSettingsComponent,
        HostDashboardComponent,
        EditionComboComponent,
        AddMemberModalComponent,
        TenantComboComponent,
    ],
    exports: [
        AddMemberModalComponent,
    ],
    providers: [
        ImpersonationService
    ],
    entryComponents: [
        EditUserPermissionsModalComponent,
        CreateOrEditRoleModalComponent,
        CreateOrEditUnitModalComponent,
        AddMemberModalComponent,
        TenantFeaturesModalComponent,
        CreateTenantModalComponent,
        EditTenantModalComponent,
        AuditLogDetailModalComponent,
        CreateOrEditEditionModalComponent,
        CreateOrEditUserModalComponent,
    ]
})
export class AdminModule {
}
