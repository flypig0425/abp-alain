import { Component, Injector, Output, EventEmitter, OnInit } from '@angular/core';
import {
    PagedResultDtoOfNameValueDto,
    NameValueDto,
    ProductTypeLookupTableDto
} from '@shared/service-proxies/service-proxies';
import { AppConsts } from '@shared/AppConsts';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/common/PagedListingComponentBase';
import { NzModalRef } from 'ng-zorro-antd';
import { Observable } from 'rxjs';

export interface ICommonLookupModalOptions {
    title?: string;
    isFilterEnabled?: boolean;
    dataSource: (skipCount: number, maxResultCount: number, filter: string, tenantId?: number) => Observable<PagedResultDtoOfNameValueDto>;
    canSelect?: (item: NameValueDto) => boolean | Observable<boolean>;
    loadOnStartup?: boolean;
    pageSize?: number;
}


@Component({
    selector: 'commonLookupModal',
    templateUrl: './common-lookup-modal.component.html'
})
export class CommonLookupModalComponent extends PagedListingComponentBase<NameValueDto> implements OnInit{

    static defaultOptions: ICommonLookupModalOptions = {
        dataSource: null,
        canSelect: () => true,
        loadOnStartup: true,
        isFilterEnabled: true,
        pageSize: AppConsts.grid.defaultPageSize
    };

    @Output() itemSelected: EventEmitter<NameValueDto> = new EventEmitter<NameValueDto>();

    options: ICommonLookupModalOptions;

    isShown = false;
    isInitialized = false;
    filterText = '';
    tenantId?: number;

    dataItems: NameValueDto[] = [];

    constructor(
        injector: Injector,
        private modal: NzModalRef
    ) {
        super(injector);
    }

    close(): void {
        this.modal.destroy();
    }

    selectItem(item: NameValueDto) {
        const boolOrPromise = this.options.canSelect(item);
        if (!boolOrPromise) {
            return;
        }

        if (boolOrPromise === true) {
            this.itemSelected.emit(item);
            this.modal.close(item);
            return;
        }

        //assume as observable
        (boolOrPromise as Observable<boolean>)
            .subscribe(result => {
                if (result) {
                    this.itemSelected.emit(item);
                    this.modal.close(item);
                }
            });
    }

    protected delete(entity: NameValueDto): void {
    }

    protected list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
        this.options
            .dataSource(request.skipCount, request.maxResultCount, this.filterText, this.tenantId)
            .subscribe(result => {
                this.dataItems = result.items;
                finishedCallback();
                this.showPaging(result, pageNumber);
            });

    }


}
