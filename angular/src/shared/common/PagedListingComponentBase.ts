import { AppComponentBase } from './app-component-base';
import { Injector, OnInit } from '@angular/core';

export class PagedResultDto {
    items: any[];
    totalCount: number;
}

export class EntityDto {
    id: number;
}

export class PagedRequestDto {
    skipCount: number;
    maxResultCount: number;
}

export abstract class PagedListingComponentBase<EntityDto> extends AppComponentBase implements OnInit {

    public pageSize = 10;
    public pageNumber = 1;
    public totalPages = 1;
    public totalItems: number;
    public isTableLoading = false;
    public isQuery = false;


    sortKey = null;
    sortValue = null;

    protected constructor(injector: Injector) {
        super(injector);
    }

    ngOnInit(): void {
        this.refresh();
    }

    sort(sort: { key: string, value: string }) {
        this.sortKey = sort.key;
        this.sortValue = sort.value;

        this.refresh();
    }

    refresh(): void {
        this.getDataPage(this.pageNumber, this.isQuery);
    }

    queryRefresh(): void {
        this.isQuery = true;
        this.pageNumber = 1;
        this.getDataPage(this.pageNumber, this.isQuery);
        this.isQuery = false;
    }

    public getSort(): string {
        let sorting = '';

        if (this.sortKey) {
            sorting = this.sortKey;

            if (this.sortValue === 'descend') {
                sorting += ' DESC';
            } else {
                sorting += ' ASC';
            }
        }

        return sorting;
    }

    public showPaging(result: PagedResultDto, pageNumber: number): void {
        this.totalPages = ((result.totalCount - (result.totalCount % this.pageSize)) / this.pageSize) + 1;
        this.totalItems = result.totalCount;
    }

    public getDataPage(page: number, isQuery: boolean): void {
        let req = new PagedRequestDto();
        req.maxResultCount = this.pageSize;
        if (isQuery) {
            req.skipCount = 0;
        } else {
            req.skipCount = (page - 1) * this.pageSize;
        }

        if (req.skipCount < 0) {
            req.skipCount = 0;
        }

        this.isTableLoading = true;
        this.list(req, page, () => {
            this.isTableLoading = false;
        });
    }

    protected abstract list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void;

    protected abstract delete(entity: EntityDto): void;
}
