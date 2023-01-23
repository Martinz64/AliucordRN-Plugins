import * as React from "react";
import QuickDownload from "..";

const settingsInstance = () => QuickDownload.instance.settings;

export const settings = {
    get individualDownloadButton() { return settingsInstance().get("individualDownloadButton", true) },
    get multipleDownloadButtons() { return settingsInstance().get("multipleDownloadButtons", true) },
    get downloadAllButton() { return settingsInstance().get("downloadAllButton", true) },
}

export const getSettings = (name?: string) => {
    const [, forceUpdate] = React.useReducer(x => x + 1, 0);
    return {
        get(key, defaultValue?) {
            if (name) {
                return settingsInstance().get(name, {})[key] ?? defaultValue;
            }
            return settingsInstance().get(key, defaultValue);
        },
        set(key, value) {
            if (name) {
                const obj = settingsInstance().get(name, {});
                obj[key] = value.length === 0 ? undefined : value;
                settingsInstance().set(name, obj);
            } else {
                settingsInstance().set(key, value);
            }
            forceUpdate();
        }
    };
}