import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import {
    UserLinkServiceProxy,
    LinkedUserDto,
    UnlinkUserInput,
    GetAllCountriesOutput
} from '@shared/service-proxies/service-proxies';
import { LinkAccountModalComponent } from './link-account-modal.component';
import { AbpMultiTenancyService } from '@abp/multi-tenancy/abp-multi-tenancy.service';
import { LinkedAccountService } from '@app/shared/layout/linked-account.service';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/common/PagedListingComponentBase';

@Component({
    selector: 'linkedAccountsModal',
    templateUrl: './linked-accounts-modal.component.html'
})
export class LinkedAccountsModalComponent extends PagedListingComponentBase<LinkedUserDto> {

    @Output() modalClose: EventEmitter<any> = new EventEmitter<any>();

    dataItems: LinkedUserDto[] = [];

    constructor(
        injector: Injector,
        private abpMultiTenancyService: AbpMultiTenancyService,
        private _userLinkService: UserLinkServiceProxy,
        private _linkedAccountService: LinkedAccountService,
        private _nzModalService: NzModalService,
        private _modal: NzModalRef) {
        super(injector);
    }

    getShownLinkedUserName(linkedUser: LinkedUserDto): string {
        if (!this.abpMultiTenancyService.isEnabled) {
            return linkedUser.username;
        }

        return (linkedUser.tenantId ? linkedUser.tenancyName : '.') + '\\' + linkedUser.username;
    }

    manageLinkedAccounts(): void {
        let title = this.l('LinkNewAccount');

        let modal = this._nzModalService.create({
            nzContent: LinkAccountModalComponent,
            nzMaskClosable: false,
            nzComponentParams: {
            },
            nzTitle: title,
            nzFooter: null
        });

        modal.afterOpen.subscribe(() => {
            const instance = modal.getContentComponent();
            instance.modalSave.subscribe(() => {
                this.refresh();
            });
        });
    }

    switchToUser(linkedUser: LinkedUserDto): void {
        this._linkedAccountService.switchToAccount(linkedUser.id, linkedUser.tenantId);
    }

    show(): void {
        // this.modal.show();
    }

    close(): void {
        this._modal.destroy();
        this.modalClose.emit(null);
    }

    protected delete(linkedUser: LinkedUserDto): void {
        this.message.confirm(
            this.l('LinkedUserDeleteWarningMessage', linkedUser.username),
            isConfirmed => {
                if (isConfirmed) {
                    const unlinkUserInput = new UnlinkUserInput();
                    unlinkUserInput.userId = linkedUser.id;
                    unlinkUserInput.tenantId = linkedUser.tenantId;

                    this._userLinkService.unlinkUser(unlinkUserInput).subscribe(() => {
                        this.refresh();
                        this.notify.success(this.l('SuccessfullyUnlinked'));
                    });
                }
            }
        );
    }

    protected list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
        this._userLinkService.getLinkedUsers(
            request.maxResultCount,
            request.skipCount,
            this.getSort())
            .subscribe(result => {
                this.dataItems = result.items;
                finishedCallback();
                this.showPaging(result, pageNumber);
            });
    }
}
