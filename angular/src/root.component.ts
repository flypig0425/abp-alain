import { Component, ElementRef,  OnInit, Renderer2 } from '@angular/core';
import { SettingsService, TitleService } from '@delon/theme';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

import { VERSION as VERSION_ALAIN } from '@delon/theme';
import { VERSION as VERSION_ZORRO, NzModalService } from 'ng-zorro-antd';

@Component({
    selector: 'app-root',
    template: `
        <router-outlet></router-outlet>`
})
export class RootComponent implements OnInit{
    constructor(
        el: ElementRef,
        renderer: Renderer2,
        private settings: SettingsService,
        private router: Router,
        private titleSrv: TitleService,
        private modalSrv: NzModalService,
    ) {
        renderer.setAttribute(
            el.nativeElement,
            'ng-alain-version',
            VERSION_ALAIN.full,
        );
        renderer.setAttribute(
            el.nativeElement,
            'ng-zorro-version',
            VERSION_ZORRO.full,
        );

        this.titleSrv.default = 'IOCC';
    }

    ngOnInit(): void {
        this.router.events
            .pipe(filter(evt => evt instanceof NavigationEnd))
            .subscribe(() => {
                this.titleSrv.setTitle();
                this.modalSrv.closeAll();
            });
    }

}
