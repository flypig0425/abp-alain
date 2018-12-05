export class LocalizedResourcesHelper {

    static loadResources(callback: () => void): void {
        $.when(LocalizedResourcesHelper.loadLocalizedStlyes(), LocalizedResourcesHelper.loadLocalizedScripts()).done(() => {
            callback();
        });
    }

    static loadLocalizedStlyes(): JQueryPromise<any> {

        return $.Deferred().resolve().promise();
    }

    private static loadLocalizedScripts(): JQueryPromise<any> {
        if (!abp.session.userId) {
            return $.Deferred().resolve().promise();
        }

        return $.Deferred().resolve().promise();
    }
}
