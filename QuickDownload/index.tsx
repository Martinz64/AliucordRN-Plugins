import { Plugin } from "aliucord/entities";
// @ts-ignore
import { getByProps, getByName, React, Forms, ButtonRow, Styles, Toasts, Locale, searchByKeyword, getModule } from "aliucord/metro";
import { Fragment } from "react";
import { findInReactTree, getAssetId } from "aliucord/utils";
import { aliucord } from "@aliucord/rollup-plugin";

import SettingsPage from "./settingsPage"
import { settings as Config } from "./utils/Settings";
import { DownloadRow } from "./DownloadRow";


const { FormDivider } = Forms;
const LazyActionSheet = getByProps("openLazy", "hideActionSheet");

const Button = getByProps("ButtonColors", "ButtonLooks", "ButtonSizes").default as any;

type FilterOptions = {
    exports?: boolean;
    default?: false;
} | {
    exports?: true;
    default?: true;
};

const { FormRow, FormSection, FormSwitch, FormInput } = Forms;

const MediaManager = getByProps("downloadMediaAsset","extractMediaFromAttachment","extractMediaFromEmbed", "extractMediaSourcesFromEmbed")

export default class QuickDownload extends Plugin {
    static instance: QuickDownload;

    getByName(defaultName: string, options?: FilterOptions) {
        return getModule(m => m?.default?.name === defaultName, options);
    }

    public start() {    
        QuickDownload.instance = this;

        /*Sheet*/
        this.patcher.before(LazyActionSheet, "openLazy", (ctx) => {
            const [component, sheet] = ctx.args;
            
            //console.log(sheet)
            /*Emoji Overview*/
            if (sheet == "MessageLongPressActionSheet"){
                component.then(instance => {
                    this.patcher.after(instance, "default", (_, component: any) => {
                        //window.sheet = component
                        const originalList = component.props?.children?.props?.children?.props?.children[1]
                        if(originalList){
                            const attachments = component.props?.children?.props?.children?.props?.children[0]?.props?.message?.attachments

                            //component.props.children.props.children.props.children[0].props.message.attachments
                            

                            if(originalList.filter(a => a.type.name == "DownloadRow").length == 0){
                                component.props.children.props.children.props.children[1] = [<DownloadRow attachments={attachments}/>].concat(originalList)
                            }
                            //MediaManager.downloadMediaAsset("url",0)
                            const downloadRowIndex = originalList.findIndex(a => a.type.name == "DownloadRow")
                            originalList[downloadRowIndex] = <DownloadRow attachments={attachments}/>

                            //(new aliucord.api.Patcher()).patch(getByProps("downloadMediaAsset"),"downloadMediaAsset",(ctx)=>{console.log("aaa",ctx.args)})
                        }
                    });
                });
            }
            
        });
    }

    
    public stop() {
    }

    public getSettingsPage() {
        return <SettingsPage />;
    }
}