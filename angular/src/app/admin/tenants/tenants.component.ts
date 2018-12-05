///<reference path="../../../shared/common/PagedListingComponentBase.ts"/>
import { Component, OnInit, Injector, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
    TenantServiceProxy,
    TenantListDto,
    NameValueDto,
    CommonLookupServiceProxy,
    FindUsersInput,
    EntityDtoOfInt64,
} from '@shared/service-proxies/service-proxies';
import { CreateTenantModalComponent } from './create-tenant-modal.component';
import { TenantFeaturesModalComponent } from './tenant-features-modal.component';
import { CommonLookupModalComponent } from '@app/shared/common/lookup/common-lookup-modal.component';
import { ImpersonationService } from '@app/admin/users/impersonation.service';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import * as moment from 'moment';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/common/PagedListingComponentBase';
import { finalize } from 'rxjs/operators';
import { ModalHelper } from '@delon/theme';

@Component({
    templateUrl: './tenants.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class TenantsComponent extends PagedListingComponentBase<TenantListDto> implements OnInit {

    dataItems: TenantListDto[] = [];

    filters: {
        filterText: string;
        creationDateRangeActive: boolean;
        subscriptionEndDateRangeActive: boolean;
        subscriptionEndDateStart: moment.Moment;
        subscriptionEndDateEnd: moment.Moment;
        creationDateStart: moment.Moment;
        creationDateEnd: moment.Moment;
        selectedEditionId: number;
    } = <any>{};

    constructor(
        injector: Injector,
        private _tenantService: TenantServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _commonLookupService: CommonLookupServiceProxy,
        private _impersonationService: ImpersonationService,
        private _modalHelper: ModalHelper,
        private _router: Router,
    ) {
        super(injector);
        this.setFiltersFromRoute();
    }

    setFiltersFromRoute(): void {
        if (this._activatedRoute.snapshot.queryParams['subscriptionEndDateStart'] != null) {
            this.filters.subscriptionEndDateRangeActive = true;
            this.filters.subscriptionEndDateStart = moment(this._activatedRoute.snapshot.queryParams['subscriptionEndDateStart']);
        } else {
            this.filters.subscriptionEndDateStart = moment().startOf('day');
        }

        if (this._activatedRoute.snapshot.queryParams['subscriptionEndDateEnd'] != null) {
            this.filters.subscriptionEndDateRangeActive = true;
            this.filters.subscriptionEndDateEnd = moment(this._activatedRoute.snapshot.queryParams['subscriptionEndDateEnd']);
        } else {
            this.filters.subscriptionEndDateEnd = moment().add(30, 'days').endOf('day');
        }

        if (this._activatedRoute.snapshot.queryParams['creationDateStart'] != null) {
            this.filters.creationDateRangeActive = true;
            this.filters.creationDateStart = moment(this._activatedRoute.snapshot.queryParams['creationDateStart']);
        } else {
            this.filters.creationDateStart = moment().add(-7, 'days').startOf('day');
        }

        if (this._activatedRoute.snapshot.queryParams['creationDateEnd'] != null) {
            this.filters.creationDateRangeActive = true;
            this.filters.creationDateEnd = moment(this._activatedRoute.snapshot.queryParams['creationDateEnd']);
        } else {
            this.filters.creationDateEnd = moment().endOf('day');
        }
    }

    ngOnInit(): void {
        this.filters.filterText = this._activatedRoute.snapshot.queryParams['filterText'] || '';

        this.refresh();
    }


    showUserImpersonateLookUpModal(record: any): void {
        let title = this.l('SelectAUser');

        this._modalHelper.createStatic(CommonLookupModalComponent, {
            tenantId: record.id,
            options: {
                dataSource: (skipCount: number, maxResultCount: number, filter: string, tenantId?: number) => {
                    let input = new FindUsersInput();
                    input.filter = filter;
                    input.maxResultCount = maxResultCount;
                    input.skipCount = skipCount;
                    input.tenantId = tenantId;
                    return this._commonLookupService.findUsers(input);
                },
                isFilterEnabled: true,
                canSelect: () => true,
            }
        }, {
            modalOptions: {
                nzTitle: title
            }
        }).subscribe((item) => {
            this.impersonateUser(item, record.id);
        });
    }

    unlockUser(record: any): void {
        this._tenantService.unlockTenantAdmin(new EntityDtoOfInt64({id: record.id})).subscribe(() => {
            this.notify.success(this.l('UnlockedTenandAdmin', record.name));
        });
    }

    createTenant(): void {
        let title = this.l('CreateNewTenant');

        this._modalHelper.createStatic(CreateTenantModalComponent, {}, {
            modalOptions: {
                nzTitle: title
            }
        }).subscribe(() => {
            this.refresh();
        });

    }

    editTenant(id: number, name: string): void {
        let title = this.l('EditTenant') + ': ' + name;

        this._modalHelper.createStatic(CreateTenantModalComponent, {
            tenantId: id
        }, {
            modalOptions: {
                nzTitle: title
            }
        }).subscribe(() => {
            this.refresh();
        });


    }

    impersonateUser(item: NameValueDto, id: number): void {
        this._impersonationService
            .impersonate(
                parseInt(item.value),
                id
            );
    }

    showTenantFeature(id: number, name: string): void {
        let title = this.l('Features') + ' - ' + name;

        this._modalHelper.createStatic(TenantFeaturesModalComponent, {
            tenantId: id,
            tenantName: name
        }, {
            modalOptions: {
                nzTitle: title
            }
        }).subscribe(() => {
        });

    }

    protected delete(tenant: TenantListDto): void {
        this.message.confirm(
            this.l('TenantDeleteWarningMessage', tenant.tenancyName),
            isConfirmed => {
                if (isConfirmed) {
                    this._tenantService.deleteTenant(tenant.id).subscribe(() => {
                        this.refresh();
                        this.notify.success(this.l('SuccessfullyDeleted'));
                    });
                }
            }
        );
    }

    protected list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
        this._tenantService.getTenants(
            this.filters.filterText,
            this.filters.subscriptionEndDateRangeActive ? this.filters.subscriptionEndDateStart : undefined,
            this.filters.subscriptionEndDateRangeActive ? this.filters.subscriptionEndDateEnd : undefined,
            this.filters.creationDateRangeActive ? this.filters.creationDateStart : undefined,
            this.filters.creationDateRangeActive ? this.filters.creationDateEnd : undefined,
            this.filters.selectedEditionId,
            this.filters.selectedEditionId !== undefined && (this.filters.selectedEditionId + '') !== '-1',
            this.getSort(),
            request.maxResultCount,
            request.skipCount
        ).pipe(finalize(() => {
            finishedCallback();
        })).subscribe(result => {
            this.dataItems = result.items;
            this.showPaging(result, pageNumber);
        });
    }
}
