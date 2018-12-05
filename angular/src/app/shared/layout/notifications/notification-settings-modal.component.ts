import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { NotificationServiceProxy, GetNotificationSettingsOutput, UpdateNotificationSettingsInput, NotificationSubscriptionDto } from '@shared/service-proxies/service-proxies';

import * as _ from 'lodash';
import { NzModalRef } from 'ng-zorro-antd';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'notificationSettingsModal',
    templateUrl: './notification-settings-modal.component.html'
})
export class NotificationSettingsModalComponent extends AppComponentBase implements OnInit{


    saving = false;

    settings: GetNotificationSettingsOutput;

    constructor(
        injector: Injector,
        private _notificationService: NotificationServiceProxy,
        private modal: NzModalRef
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.getSettings(
            () => {}
        );
    }

    save(): void {
        const input = new UpdateNotificationSettingsInput();
        input.receiveNotifications = this.settings.receiveNotifications;
        input.notifications = _.map(this.settings.notifications,
            (n) => {
                let subscription = new NotificationSubscriptionDto();
                subscription.name = n.name;
                subscription.isSubscribed = n.isSubscribed;
                return subscription;
            });

        this.saving = true;
        this._notificationService.updateNotificationSettings(input)
            .pipe(finalize(() => { this.saving = false; } ))
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
            });
    }

    close(): void {
        this.modal.destroy();
    }

    private getSettings(callback: () => void) {
        this._notificationService.getNotificationSettings().subscribe((result: GetNotificationSettingsOutput) => {
            this.settings = result;
            callback();
        });
    }


}
