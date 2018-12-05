import { NotifyService } from '@abp/notify/notify.service';
import { Component, Injector } from '@angular/core';
import { AuditLogDetailModalComponent } from '@app/admin/audit-logs/audit-log-detail-modal.component';
import { ModalHelper } from '@delon/theme';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/common/PagedListingComponentBase';
import { AuditLogListDto, AuditLogServiceProxy } from '@shared/service-proxies/service-proxies';
import { FileDownloadService } from '@shared/utils/file-download.service';
import * as moment from 'moment';
import { finalize } from 'rxjs/internal/operators';


@Component({
    templateUrl: './audit-logs.component.html',
    styleUrls: ['./audit-logs.component.less'],
    animations: [appModuleAnimation()]
})
export class AuditLogsComponent extends PagedListingComponentBase<AuditLogListDto> {
    //Filters
    public startDate: moment.Moment = moment().startOf('day');
    public endDate: moment.Moment = moment().endOf('day');
    public username: string;
    public serviceName: string;
    public methodName: string;
    public browserInfo: string;
    public hasException: boolean = undefined;
    public minExecutionDuration: number;
    public maxExecutionDuration: number;

    advancedFiltersAreShown = false;

    dataItems: AuditLogListDto[] = [];

    constructor(
        injector: Injector,
        private _auditLogService: AuditLogServiceProxy,
        private _notifyService: NotifyService,
        private _fileDownloadService: FileDownloadService,
        private _modalHelper: ModalHelper
    ) {
        super(injector);
    }

    showDetails(record: AuditLogListDto): void {
        let title = this.l('AuditLogDetail');

        this._modalHelper.createStatic(AuditLogDetailModalComponent, {
            auditLog: record
        }, {
            modalOptions: {
                nzTitle: title
            }
        }).subscribe(() => {
        });
    }

    exportToExcel(): void {
        const self = this;
        self._auditLogService.getAuditLogsToExcel(
            self.startDate,
            self.endDate,
            self.username,
            self.serviceName,
            self.methodName,
            self.browserInfo,
            self.hasException,
            self.minExecutionDuration,
            self.maxExecutionDuration,
            undefined,
            1,
            0)
            .subscribe(result => {
                self._fileDownloadService.downloadTempFile(result);
            });
    }

    truncateStringWithPostfix(text: string, length: number): string {
        return abp.utils.truncateStringWithPostfix(text, length);
    }

    protected delete(entity: AuditLogListDto): void {
    }

    protected list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
        this._auditLogService.getAuditLogs(
            this.startDate,
            this.endDate,
            this.username,
            this.serviceName,
            this.methodName,
            this.browserInfo,
            this.hasException,
            this.minExecutionDuration,
            this.maxExecutionDuration,
            this.getSort(),
            request.maxResultCount,
            request.skipCount,
        ).pipe(finalize(() => {
            finishedCallback();
        })).subscribe((result) => {
            this.dataItems = result.items;
            this.showPaging(result, pageNumber);
        });
    }
}
