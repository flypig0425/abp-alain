import { Injectable } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';
import { expand } from 'rxjs/operators';

@Injectable()
export class CustomMessageService {

    constructor(private modalService: NzModalService) {
    }

    Init() {
        abp.message.info = (message, title) => {
            let displayTitle = title == null ? message : title;
            this.modalService.info({
                nzTitle: displayTitle,
                nzContent: message,
            });
        };

        // 弹出框提示
        abp.message.success = (message, title) => {
            let displayTitle = title == null ? message : title;
            this.modalService.success({
                nzTitle: displayTitle,
                nzContent: message
            });
        };

        abp.message.warn = (message, title) => {
            let displayTitle = title == null ? message : title;
            this.modalService.warning({
                nzTitle: displayTitle,
                nzContent: message
            });
        };

        abp.message.error = (message, title) => {
            let displayTitle = title == null ? message : title;
            this.modalService.error({
                nzTitle: displayTitle,
                nzContent: message
            });
        };

        abp.message.confirm = (message, callback) => {
            this.modalService.confirm({
                nzTitle: '确认操作',
                nzContent: message,
                nzOnOk() {
                    if (callback) {
                        callback(true);
                    }
                },
                nzOnCancel() {
                    if (callback) {
                        callback(false);
                    }
                }
            });
        };
    }

}
