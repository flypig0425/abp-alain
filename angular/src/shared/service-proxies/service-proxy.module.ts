import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AbpHttpInterceptor } from '@abp/abpHttpInterceptor';

import * as ApiServiceProxies from './service-proxies';

@NgModule({
    providers: [
        ApiServiceProxies.AlertsServiceProxy,        
        ApiServiceProxies.ThresholdsServiceProxy,        
        ApiServiceProxies.ServiceLogServiceProxy,
        ApiServiceProxies.VpnDevicesServiceProxy,
        ApiServiceProxies.VpnTypesServiceProxy,
        ApiServiceProxies.EquipmentStaticsServiceProxy,
        ApiServiceProxies.EquipmentsServiceProxy,
        ApiServiceProxies.CustomersServiceProxy,
        ApiServiceProxies.ProvincesServiceProxy,
        ApiServiceProxies.CountriesServiceProxy,
        ApiServiceProxies.ProductModelsServiceProxy,
        ApiServiceProxies.ProductTypesServiceProxy,
        ApiServiceProxies.AuditLogServiceProxy,
        ApiServiceProxies.CachingServiceProxy,
        ApiServiceProxies.CommonLookupServiceProxy,
        ApiServiceProxies.EditionServiceProxy,
        ApiServiceProxies.HostSettingsServiceProxy,
        ApiServiceProxies.InstallServiceProxy,
        ApiServiceProxies.LanguageServiceProxy,
        ApiServiceProxies.NotificationServiceProxy,
        ApiServiceProxies.OrganizationUnitServiceProxy,
        ApiServiceProxies.PermissionServiceProxy,
        ApiServiceProxies.ProfileServiceProxy,
        ApiServiceProxies.RoleServiceProxy,
        ApiServiceProxies.SessionServiceProxy,
        ApiServiceProxies.TenantServiceProxy,
        ApiServiceProxies.TenantDashboardServiceProxy,
        ApiServiceProxies.TenantSettingsServiceProxy,
        ApiServiceProxies.TimingServiceProxy,
        ApiServiceProxies.UserServiceProxy,
        ApiServiceProxies.UserLinkServiceProxy,
        ApiServiceProxies.UserLoginServiceProxy,
        ApiServiceProxies.WebLogServiceProxy,
        ApiServiceProxies.AccountServiceProxy,
        ApiServiceProxies.TokenAuthServiceProxy,
        ApiServiceProxies.TenantRegistrationServiceProxy,
        ApiServiceProxies.HostDashboardServiceProxy,
        ApiServiceProxies.PaymentServiceProxy,
        ApiServiceProxies.InvoiceServiceProxy,
        ApiServiceProxies.SubscriptionServiceProxy,
        ApiServiceProxies.InstallServiceProxy,
        ApiServiceProxies.UiCustomizationSettingsServiceProxy,
        ApiServiceProxies.EquipmentFollowsServiceProxy,
        ApiServiceProxies.ESServiceProxy,
        {provide: HTTP_INTERCEPTORS, useClass: AbpHttpInterceptor, multi: true}
    ]
})
export class ServiceProxyModule {
}
