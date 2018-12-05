import {
    Component,
    ViewChild,
    ComponentFactoryResolver,
    ViewContainerRef,
    AfterViewInit,
    OnInit,
    OnDestroy,
    ElementRef,
    Renderer2,
    Inject, Injector,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NavigationCancel, NavigationEnd, NavigationError, RouteConfigLoadStart, Router } from '@angular/router';
import { AppComponentBase } from 'shared/common/app-component-base';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { SubscriptionStartType } from '@shared/AppEnums';
import { UrlHelper } from '@shared/helpers/UrlHelper';
import { Menu, MenuService, SettingsService, TitleService } from '@delon/theme';
import { environment } from '@env/environment';
import { SettingDrawerComponent } from '@app/shared/layout/setting-drawer/setting-drawer.component';
import { Subscription } from 'rxjs';
import { updateHostClass } from '@delon/util';

@Component({
    selector: 'app-app',
    templateUrl: './app.component.html',
})
export class AppComponent extends AppComponentBase implements OnInit, AfterViewInit {

    private notify$: Subscription;
    isFetching = false;

    @ViewChild('settingHost', { read: ViewContainerRef })
    settingHost: ViewContainerRef;

    private viewContainerRef: ViewContainerRef;
    private router: Router;

    subscriptionStartType = SubscriptionStartType;
    installationMode = true;

    public constructor(
        injector: Injector,
        viewContainerRef: ViewContainerRef,
        private _router: Router,
        private resolver: ComponentFactoryResolver,
        private settings: SettingsService,
        private _appSessionService: AppSessionService,
        private menuService: MenuService,
        private titleSrv: TitleService,
        private el: ElementRef,
        private renderer: Renderer2,
        @Inject(DOCUMENT) private doc: any,) {
        super(injector);
        this.viewContainerRef = viewContainerRef; // You need this small hack in order to catch application root view container ref (required by ng2 bootstrap modal)
        this.router = _router;

        // scroll to top in change page
        _router.events.subscribe(evt => {
            if (!this.isFetching && evt instanceof RouteConfigLoadStart) {
                this.isFetching = true;
            }
            if (evt instanceof NavigationError || evt instanceof NavigationCancel) {
                this.isFetching = false;
                if (evt instanceof NavigationError) {
                    // this.message.error(`无法加载${evt.url}路由`, { nzDuration: 1000 * 3 });
                }
                return;
            }
            if (!(evt instanceof NavigationEnd)) {
                return;
            }
            setTimeout(() => {
                // scroll.scrollToTop();
                this.isFetching = false;
            }, 100);
        });


        this.initMenuService();
    }

    private setClass() {
        const { el, renderer, settings } = this;
        const layout = settings.layout;
        updateHostClass(
            el.nativeElement,
            renderer,
            {
                ['alain-default']: true,
                [`alain-default__fixed`]: layout.fixed,
                [`alain-default__boxed`]: layout.boxed,
                [`alain-default__collapsed`]: layout.collapsed,
            },
            true,
        );

        this.doc.body.classList[layout.colorWeak ? 'add' : 'remove']('color-weak');
    }

    ngOnInit(): void {
        this.installationMode = UrlHelper.isInstallUrl(location.href);

        this.notify$ = this.settings.notify.subscribe(() => this.setClass());
        this.setClass();
    }

    ngOnDestroy() {
        this.notify$.unsubscribe();
    }

    ngAfterViewInit(): void {
        // Setting componet for only developer
        if (!environment.production) {
            setTimeout(() => {
                const settingFactory = this.resolver.resolveComponentFactory(
                    SettingDrawerComponent,
                );
                this.settingHost.createComponent(settingFactory);
            }, 22);
        }

    }

    initMenuService(): void {
        this.menuService.add([
            {
                text: '主导航',
                group: true,

                children: [
                    {
                        text: this.l('Dashboard'),
                        link: '/app/admin/hostDashboard',
                        icon: 'anticon anticon-dashboard',
                        acl: 'Pages.Administration.Host.Dashboard'
                    },

                    {
                        text: this.l('Dashboard'),
                        link: '/app/admin/dashboard',
                        icon: 'anticon anticon-dashboard',
                        acl: 'Pages.Tenant.Dashboard'
                    },

                    {
                        text: this.l('Tenants'),
                        link: '/app/admin/tenants',
                        icon: 'anticon anticon-shop',
                        acl: 'Pages.Tenants'
                    },

                    {
                        text: this.l('Editions'),
                        link: '/app/admin/editions',
                        icon: 'anticon anticon-shop',
                        acl: 'Pages.Editions'
                    },

                    {
                        text: this.l('Administration'),
                        link: '',
                        icon: 'anticon anticon-appstore',
                        children: [
                            {
                                text: this.l('OrganizationUnits'),
                                link: '/app/admin/organization-units',
                                icon: 'anticon anticon-team',
                                acl: 'Pages.Administration.OrganizationUnits'
                            },

                            {
                                text: this.l('Roles'),
                                link: '/app/admin/roles',
                                icon: 'anticon anticon-safety',
                                acl: 'Pages.Administration.Roles'
                            },

                            {
                                text: this.l('Users'),
                                link: '/app/admin/users',
                                icon: 'anticon anticon-user',
                                acl: 'Pages.Administration.Users'
                            },

                            {
                                text: this.l('Languages'),
                                link: '/app/admin/languages',
                                icon: 'anticon anticon-global',
                                acl: 'Pages.Administration.Languages'
                            },

                            {
                                text: this.l('AuditLogs'),
                                link: '/app/admin/auditLogs',
                                icon: 'anticon anticon-book',
                                acl: 'Pages.Administration.AuditLogs'
                            },

                            {
                                text: this.l('Maintenance'),
                                link: '/app/admin/maintenance',
                                icon: 'anticon anticon-tag-o',
                                acl: 'Pages.Administration.Host.Maintenance'
                            },

                            {
                                text: this.l('Settings'),
                                link: '/app/admin/hostSettings',
                                icon: 'anticon anticon-setting',
                                acl: 'Pages.Administration.Host.Settings'
                            },

                            {
                                text: this.l('Settings'),
                                link: '/app/admin/tenantSettings',
                                icon: 'anticon anticon-setting',
                                acl: 'Pages.Administration.Tenant.Dashboard'
                            }
                        ]
                    },
                ]
            },

        ]);
    }

}
