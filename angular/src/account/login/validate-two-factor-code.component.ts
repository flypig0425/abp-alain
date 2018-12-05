import { Component, Injector, OnInit, OnDestroy } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AppComponentBase } from '@shared/common/app-component-base';
import { LoginService } from './login.service';

import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { Observable, Subscription, timer } from 'rxjs';

@Component({
    templateUrl: './validate-two-factor-code.component.html',
    styleUrls: ['./validate-two-factor-code.component.less'],
    animations: [accountModuleAnimation()]
})
export class ValidateTwoFactorCodeComponent extends AppComponentBase implements CanActivate, OnInit, OnDestroy {

    code: string;
    submitting = false;
    remainingSeconds = 90;
    timerSubscription: Subscription;

    constructor(
        injector: Injector,
        public loginService: LoginService,
        private _router: Router
    ) {
        super(injector);
    }

    canActivate(): boolean {
        if (this.loginService.authenticateModel &&
            this.loginService.authenticateResult
        ) {
            return true;
        }

        return false;
    }

    ngOnInit(): void {
        this.timerSubscription = timer(1000, 1000).subscribe(() => {
            this.remainingSeconds = this.remainingSeconds - 1;
            if (this.remainingSeconds <= 0) {
                this.message.warn(this.l('TimeoutPleaseTryAgain')).done(() => {
                    this.loginService.authenticateModel.twoFactorVerificationCode = null;
                    this._router.navigate(['account/login']);
                });
            }
        });
    }

    ngOnDestroy(): void {
        if (this.timerSubscription) {
            this.timerSubscription.unsubscribe();
            this.timerSubscription = null;
        }
    }

    submit(): void {
        this.loginService.authenticateModel.twoFactorVerificationCode = this.code;
        this.loginService.authenticate();
    }
}
