import { Component, Injector, Output, EventEmitter, ElementRef, OnInit } from '@angular/core';
import { UserLinkServiceProxy, LinkToUserInput } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { NzModalRef } from 'ng-zorro-antd';
import { finalize } from 'rxjs/internal/operators';

@Component({
    selector: 'linkAccountModal',
    templateUrl: './link-account-modal.component.html',
    styleUrls: ['./link-account-modal.component.less']
})
export class LinkAccountModalComponent extends AppComponentBase implements OnInit{

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    saving = false;

    linkUser: LinkToUserInput = new LinkToUserInput();

    constructor(
        injector: Injector,
        private _userLinkService: UserLinkServiceProxy,
        private _sessionAppService: AppSessionService,
        private modal: NzModalRef
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.show();
    }

    show(): void {
        this.linkUser = new LinkToUserInput();
        this.linkUser.tenancyName = this._sessionAppService.tenancyName;
    }

    save(): void {
        this.saving = true;
        this._userLinkService.linkToUser(this.linkUser)
            .pipe(finalize(() => { this.saving = false; }))
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit(null);
            });
    }

    close(): void {
        this.modal.destroy();
    }

}
