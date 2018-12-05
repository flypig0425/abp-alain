import { Component, Injector, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import {
    LanguageServiceProxy,
    ApplicationLanguageListDto,
    SetDefaultLanguageInput} from '@shared/service-proxies/service-proxies';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/common/PagedListingComponentBase';
import { finalize } from 'rxjs/internal/operators';

@Component({
    templateUrl: './languages.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class LanguagesComponent extends PagedListingComponentBase<ApplicationLanguageListDto> {

    loading = false;
    dataItems: ApplicationLanguageListDto[] = [];

    defaultLanguageName: string;

    constructor(
        injector: Injector,
        private _languageService: LanguageServiceProxy,
        private _router: Router
    ) {
        super(injector);
    }

    changeTexts(language: ApplicationLanguageListDto): void {
        this._router.navigate(['app/admin/languages', language.name, 'texts']);
    }

    setAsDefaultLanguage(language: ApplicationLanguageListDto): void {
        const input = new SetDefaultLanguageInput();
        input.name = language.name;
        this._languageService.setDefaultLanguage(input).subscribe(() => {
            this.refresh();
            this.notify.success(this.l('SuccessfullySaved'));
        });
    }

    deleteLanguage(language: ApplicationLanguageListDto): void {
        this.message.confirm(
            this.l('LanguageDeleteWarningMessage', language.displayName),
            isConfirmed => {
                if (isConfirmed) {
                    this._languageService.deleteLanguage(language.id).subscribe(() => {
                        this.refresh();
                        this.notify.success(this.l('SuccessfullyDeleted'));
                    });
                }
            }
        );
    }

    protected delete(language: ApplicationLanguageListDto): void {
        this.message.confirm(
            this.l('LanguageDeleteWarningMessage', language.displayName),
            isConfirmed => {
                if (isConfirmed) {
                    this._languageService.deleteLanguage(language.id).subscribe(() => {
                        this.refresh();
                        this.notify.success(this.l('SuccessfullyDeleted'));
                    });
                }
            }
        );
    }

    protected list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
        this._languageService.getLanguages().pipe(finalize(() => {
            finishedCallback();
            this.loading = false;
        })).subscribe(result => {
            this.dataItems = result.items;
        });
    }
}
