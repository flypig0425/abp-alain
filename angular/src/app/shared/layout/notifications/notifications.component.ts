import { Component, Injector, ViewChild, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { LinkedUserDto, NotificationServiceProxy, UserNotification } from '@shared/service-proxies/service-proxies';
import { UserNotificationHelper, IFormattedUserNotification } from './UserNotificationHelper';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppUserNotificationState } from '@shared/AppEnums';


import * as moment from 'moment';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/common/PagedListingComponentBase';
import { NzModalService } from 'ng-zorro-antd';
import { ReuseTabService } from '@delon/abc';

@Component({
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.less'],
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class NotificationsComponent extends PagedListingComponentBase<UserNotification> {

    readStateFilter = 'ALL';
    loading = false;
    dataItems: UserNotification[] = [];

    constructor(
        injector: Injector,
        private _notificationService: NotificationServiceProxy,
        private _userNotificationHelper: UserNotificationHelper,
        private changeDetectorRef: ChangeDetectorRef,
        private _nzModalService: NzModalService,
        private _reuseTabService: ReuseTabService
    ) {
        super(injector);

        _reuseTabService.title = this.l('Notifications');
    }

    setAsRead(record: any): void {
        this.setNotificationAsRead(record, () => {
            this.refresh();
        });
    }

    isRead(record: any): boolean {
        return record.formattedNotification.state === 'READ';
    }

    fromNow(date: moment.Moment): string {
        return moment(date).fromNow();
    }

    formatRecord(record: any): IFormattedUserNotification {
        return this._userNotificationHelper.format(record, false);
    }

    formatNotification(record: any): string {
        const formattedRecord = this.formatRecord(record);
        return abp.utils.truncateStringWithPostfix(formattedRecord.text, 120);
    }

    formatNotifications(records: any[]): any[] {
        const formattedRecords = [];
        for (const record of records) {
            record.formattedNotification = this.formatRecord(record);
            formattedRecords.push(record);
        }
        return formattedRecords;
    }

    truncateString(text: any, length: number): string {
        return abp.utils.truncateStringWithPostfix(text, length);
    }

    setAllNotificationsAsRead(): void {
        this._userNotificationHelper.setAllAsRead(() => {
            this.refresh();
        });
    }

    openNotificationSettingsModal(): void {
        this._userNotificationHelper.openSettingsModal();
    }

    setNotificationAsRead(userNotification: UserNotification, callback: () => void): void {
        this._userNotificationHelper
            .setAsRead(userNotification.id, () => {
                if (callback) {
                    callback();
                }
            });
    }

    public getRowClass(formattedRecord: IFormattedUserNotification): string {
        return formattedRecord.state === 'READ' ? 'notification-read' : '';
    }

    protected delete(entity: UserNotification): void {
    }

    protected list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
        this._notificationService.getUserNotifications(
            this.readStateFilter === 'ALL' ? undefined : AppUserNotificationState.Unread,
            request.maxResultCount,
            request.skipCount
        ).subscribe((result) => {
            this.dataItems = result.items;
            finishedCallback();
            this.showPaging(result, pageNumber);
        });
    }
}
