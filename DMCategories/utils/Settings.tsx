import * as React from "react";
import DMCategories from "..";

const settingsInstance = () => DMCategories.instance.settings;

export const settings = {
    get categories() { return JSON.parse(settingsInstance().get("categories", "[]")) },
    getCategories(){
        return JSON.parse(settingsInstance().get("categories", "[]"));
    },
    setCategories(categories){
        settingsInstance().set("categories", JSON.stringify(categories));
    },
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