import { Component, Injector, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserServiceProxy, UserListDto, EntityDtoOfInt64, RoleListDto } from '@shared/service-proxies/service-proxies';
import { NotifyService } from '@abp/notify/notify.service';
import { AppConsts } from '@shared/AppConsts';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { CreateOrEditUserModalComponent } from './create-or-edit-user-modal.component';
import { EditUserPermissionsModalComponent } from './edit-user-permissions-modal.component';
import { ImpersonationService } from './impersonation.service';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/common/PagedListingComponentBase';
import { finalize } from 'rxjs/operators';
import { ModalHelper } from '@delon/theme';

@Component({
    templateUrl: './users.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class UsersComponent extends PagedListingComponentBase<UserListDto> {

    //Filters
    advancedFiltersAreShown = false;
    filterText = '';
    selectedPermission = '';
    role: number = undefined;

    dataItems: UserListDto[] = [];

    constructor(
        injector: Injector,
        public _impersonationService: ImpersonationService,
        private _userServiceProxy: UserServiceProxy,
        private _notifyService: NotifyService,
        private _fileDownloadService: FileDownloadService,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _modalHelper: ModalHelper
    ) {
        super(injector);
        this.filterText = this._activatedRoute.snapshot.queryParams['filterText'] || '';
    }

    unlockUser(userId: number, userName?: string): void {
        this._userServiceProxy.unlockUser(new EntityDtoOfInt64({id: userId})).subscribe(() => {
            this.notify.success(this.l('UnlockedTheUser', userName));
        });
    }

    deleteUser(userId: number, userName?: string): void {
        let self = this;
        self.message.confirm(
            self.l('UserDeleteWarningMessage', userName),
            isConfirmed => {
                if (isConfirmed) {
                    this._userServiceProxy.deleteUser(userId).subscribe(() => {
                        this.refresh();
                        abp.notify.success(this.l('SuccessfullyDeleted'));
                    });
                }
            }
        );
    }

    getRolesAsString(roles): string {
        let roleNames = '';

        for (let j = 0; j < roles.length; j++) {
            if (roleNames.length) {
                roleNames = roleNames + ', ';
            }

            roleNames = roleNames + roles[j].roleName;
        }

        return roleNames;
    }

    exportToExcel(): void {
        this._userServiceProxy.getUsersToExcel()
            .subscribe(result => {
                this._fileDownloadService.downloadTempFile(result);
            });
    }

    changePermission(userId: number, userName?: string) {
        let title = this.l('Permissions');
        if (userName) {
            title += ' - ' + userName;
        }

        this._modalHelper.createStatic(EditUserPermissionsModalComponent,
            {
                userId: userId,
                userName: userName
            }, {
                modalOptions: {
                    nzTitle: title
                }
            }).subscribe( () => {});
    }

    createOrUpdateUser(userId: number, userName?: string): void {
        let title = this.l('CreateNewUser');
        if (userName) {
            title = this.l('EditUser') + ': ' + userName;
        }

        this._modalHelper.createStatic(CreateOrEditUserModalComponent,
            {
                userId: userId,
                userName: userName
            }, {
                modalOptions: {
                    nzTitle: title
                }
            }).subscribe( () => {});

    }

    protected delete(user: UserListDto): void {
        if (user.userName === AppConsts.userManagement.defaultAdminUserName) {
            this.message.warn(this.l('{0}UserCannotBeDeleted', AppConsts.userManagement.defaultAdminUserName));
            return;
        }

        this.message.confirm(
            this.l('UserDeleteWarningMessage', user.userName),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._userServiceProxy.deleteUser(user.id)
                        .subscribe(() => {
                            this.refresh();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        );
    }

    protected list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
        this._userServiceProxy.getUsers(
            this.filterText ? this.filterText : '',
            this.permission ? this.selectedPermission : undefined,
            this.role,
            this.getSort(),
            request.maxResultCount,
            request.skipCount
        ).pipe(finalize(() => {
            finishedCallback();
        })).subscribe(result => {
            this.dataItems = result.items;
            this.showPaging(result, pageNumber);
        });
    }
}
