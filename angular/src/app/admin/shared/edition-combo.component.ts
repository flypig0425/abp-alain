import {
    Component,
    OnInit,
    AfterViewInit,
    ElementRef,
    ViewChild,
    Injector,
    Input,
    Output,
    EventEmitter

} from '@angular/core';
import { EditionServiceProxy, ComboboxItemDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    selector: 'edition-combo',
    template:
            `
        <nz-select nzShowSearch nzAllowClear
                   [(ngModel)]="selectedEdition"
                   (ngModelChange)="selectedEditionChange.emit($event)" class="width-percent-100">
            <nz-option *ngFor="let edition of editions" [nzValue]="edition.value"
                       [nzLabel]="edition.displayText"></nz-option>
        </nz-select>
    `
})
export class EditionComboComponent extends AppComponentBase implements OnInit, AfterViewInit {

    editions: ComboboxItemDto[] = [];

    @Input() selectedEdition: string = undefined;
    @Output() selectedEditionChange: EventEmitter<string> = new EventEmitter<string>();

    constructor(
        private _editionService: EditionServiceProxy,
        injector: Injector) {
        super(injector);
    }

    ngOnInit(): void {
        let self = this;
        this._editionService.getEditionComboboxItems(0, true, false).subscribe(editions => {
            this.editions = editions;
        });
    }

    ngAfterViewInit(): void {

    }
}
