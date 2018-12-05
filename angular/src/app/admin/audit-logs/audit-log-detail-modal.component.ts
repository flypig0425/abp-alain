import { Component, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AuditLogListDto } from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';
import { NzModalRef } from 'ng-zorro-antd';


@Component({
    selector: 'auditLogDetailModal',
    templateUrl: './audit-log-detail-modal.component.html',
})
export class AuditLogDetailModalComponent extends AppComponentBase {

    active = false;
    auditLog: AuditLogListDto;

    constructor(
        injector: Injector,
        private modal: NzModalRef,
    ) {
        super(injector);
    }

    getExecutionTime(): string {
        const self = this;
        return moment(self.auditLog.executionTime).fromNow() + ' (' + moment(self.auditLog.executionTime).format('YYYY-MM-DD HH:mm:ss') + ')';
    }

    getDurationAsMs(): string {
        const self = this;
        return self.l('Xms', self.auditLog.executionDuration);
    }

    getFormattedParameters(): string {
        const self = this;
        try {
            const json = JSON.parse(self.auditLog.parameters);
            return JSON.stringify(json, null, 4);
        } catch (e) {
            return self.auditLog.parameters;
        }
    }

    show(record: AuditLogListDto): void {
        const self = this;
        self.active = true;
        self.auditLog = record;
        //self.modal.show();
    }

    close(): void {
        this.modal.destroy();
    }
}
