import { Component, Injector, ViewChild } from '@angular/core';
import { EditionServiceProxy, EditionListDto } from '@shared/service-proxies/service-proxies';
import { CreateOrEditEditionModalComponent } from './create-or-edit-edition-modal.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/common/PagedListingComponentBase';
import { ModalHelper } from '@delon/theme';

@Component({
    templateUrl: './editions.component.html',
    animations: [appModuleAnimation()]
})
export class EditionsComponent extends PagedListingComponentBase<EditionListDto> {

    dataItems: EditionListDto[] = [];

    constructor(
        injector: Injector,
        private _editionService: EditionServiceProxy,
        private _modalHelper: ModalHelper
    ) {
        super(injector);
    }

    createEdition(): void {
        let title = this.l('CreateNewEdition');

        this._modalHelper.createStatic(CreateOrEditEditionModalComponent, {}, {
            modalOptions: {
                nzTitle: title
            }
        }).subscribe(() => {
            this.refresh();
        });

    }

    editEdition(item: EditionListDto): void {
        let title = this.l('EditEdition') + item.displayName;

        this._modalHelper.createStatic(CreateOrEditEditionModalComponent, {
            editionId: item.id
        }, {
            modalOptions: {
                nzTitle: title
            }
        }).subscribe(() => {
            this.refresh();
        });
    }

    protected delete(edition: EditionListDto): void {
        this.message.confirm(
            this.l('EditionDeleteWarningMessage', edition.displayName),
            isConfirmed => {
                if (isConfirmed) {
                    this._editionService.deleteEdition(edition.id).subscribe(() => {
                        this.refresh();
                        this.notify.success(this.l('SuccessfullyDeleted'));
                    });
                }
            }
        );
    }

    protected list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
        this._editionService.getEditions().subscribe(result => {
            this.dataItems = result.items;
            finishedCallback();
        });
    }
}
