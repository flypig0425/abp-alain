import { Component, OnInit, Injector, ViewEncapsulation } from '@angular/core';
import { UserServiceProxy, ChangeUserLanguageDto, ProfileServiceProxy } from '@shared/service-proxies/service-proxies';


import * as _ from 'lodash';
import { AppComponentBase } from '@shared/common/app-component-base';
import { NzI18nService } from 'ng-zorro-antd';

@Component({
    selector: 'header-i18n',
    template: `
        <nz-dropdown *ngIf="languages.length" [nzTrigger]="'click'">
            <a nz-dropdown style="width: 100%" class="alain-default__nav-item">
                <i [class]="currentLanguage.icon"></i>
                <span>{{currentLanguage.displayName}}</span>
                <i class="anticon anticon-down"></i>
            </a>
            <ul nz-menu>
                <li nz-menu-item *ngFor="let language of languages"
                    [nzSelected]="language.name == currentLanguage.name"
                    (click)="changeLanguage(language.name)">
                    <i [class]="language.icon"></i>
                    <span>{{language.displayName}}</span>
                </li>
            </ul>
        </nz-dropdown>
    `
})
export class HeaderI18nComponent extends AppComponentBase implements OnInit {

    languages: abp.localization.ILanguageInfo[];
    currentLanguage: abp.localization.ILanguageInfo;

    constructor(
        injector: Injector,
        private _userService: UserServiceProxy,
        private _profileServiceProxy: ProfileServiceProxy,
        private nzI18nService: NzI18nService
    ) {
      super(injector);
    }

    ngOnInit() {
      this.languages = _.filter(this.localization.languages, l => !l.isDisabled);
      this.currentLanguage = this.localization.currentLanguage;
    }

    changeLanguage(languageName: string): void {
        const input = new ChangeUserLanguageDto();
        input.languageName = languageName;

        this._profileServiceProxy.changeLanguage(input).subscribe(() => {
            abp.utils.setCookieValue(
                'Abp.Localization.CultureName',
                languageName,
                new Date(new Date().getTime() + 5 * 365 * 86400000), //5 year
                abp.appPath
            );

            window.location.reload();
        });
    }
  }
