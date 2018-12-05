import { Component, ViewChild, Injector, Output, EventEmitter, ElementRef } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ProfileServiceProxy, VerifySmsCodeInputDto } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/internal/operators';
import { NzModalRef } from 'ng-zorro-antd';

@Component({
    selector: 'smsVerificationModal',
    templateUrl: './sms-verification-modal.component.html'
})
export class SmsVerificationModalComponent extends AppComponentBase {

    public saving = false;
    public verifyCode: VerifySmsCodeInputDto = new VerifySmsCodeInputDto();

    constructor(
        injector: Injector,
        private _profileService: ProfileServiceProxy,
        private modal: NzModalRef,
    ) {
        super(injector);
    }

    close(): void {
        this.modal.destroy();
    }

    save(): void {
        this.saving = true;
        this._profileService.verifySmsCode(this.verifyCode)
            .pipe(finalize(() => {this.saving = false;}))
            .subscribe(() => {
                this.modal.close(true);
            });
    }
}
