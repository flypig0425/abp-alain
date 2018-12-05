import { Injectable } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';

@Injectable()
export class CustomNotifyService {
    constructor(private _notification: NzNotificationService) {

    }

    Init() {
        abp.notify.info = (message: string, title?: string) => {
            this._notification.info(title, message);
        };

        // 提醒
        abp.notify.success = (message: string, title?: string) => {
            this._notification.success(title, message);
        };

        abp.notify.warn = (message: string, title?: string) => {
            this._notification.warning(title, message);
        };
        abp.notify.error = (message: string, title?: string) => {
            this._notification.error(title, message);
        };
    }

}
