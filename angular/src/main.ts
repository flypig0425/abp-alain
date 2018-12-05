import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';

import 'moment/min/locales.min';
import 'moment-timezone';
import { registerLocaleData } from '@angular/common';

import { environment } from './environments/environment';
import { RootModule } from './root.module';
import { hmrBootstrap } from './hmr';

import './polyfills.ts';

import { preloaderFinished } from '@delon/theme';
preloaderFinished();

import zh from '@angular/common/locales/zh';
registerLocaleData(zh);


if (environment.production) {
    enableProdMode();
}

const bootstrap = () => {
    return platformBrowserDynamic().bootstrapModule(RootModule)
        .then(res => {
            if ((<any>window).appBootstrap) {
                (<any>window).appBootstrap();
            }
            return res;
        });
};

/* "Hot Module Replacement" is enabled as described on
 * https://medium.com/@beeman/tutorial-enable-hrm-in-angular-cli-apps-1b0d13b80130#.sa87zkloh
 */

if (environment.hmr) {
    if (module['hot']) {
        hmrBootstrap(module, bootstrap); //HMR enabled bootstrap
    } else {
        console.error('HMR is not enabled for webpack-dev-server!');
        console.log('Are you using the --hmr flag for ng serve?');
    }
} else {
    bootstrap(); //Regular bootstrap
}
