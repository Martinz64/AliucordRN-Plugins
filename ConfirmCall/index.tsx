import { Plugin } from 'aliucord/entities';
// @ts-ignore
import { getModule, getByProps, Toasts, React, ReactNative, Dialog, Locale, FormRow } from 'aliucord/metro';
import { getAssetId } from 'aliucord/utils';
import { after } from "aliucord/utils/patcher";

const LazyActionSheet = getByProps("openLazy", "hideActionSheet");


type FilterOptions = {
    exports?: boolean;
    default?: false;
} | {
    exports?: true;
    default?: true;
};

export default class ConfirmCall extends Plugin {
    private getByName(defaultName: string, options?: FilterOptions) {
        return getModule(m => m?.default?.name === defaultName, options);
    }

    private yesNoPrompt(title: string, yesFunction: any, noFunction: any){
        Dialog.show({
            title: title,
            confirmText: "Yes",
            cancelText: "No",
            isDismissable: true,
            onConfirm: yesFunction,
            onCancel: noFunction
        })
    }

    CALL_PROMPT = "Call user?"
    VIDEO_CALL_PROMPT = "Start video call with user?"
    FRIEND_REQ_PROMPT = "Send friend request?"


    public async start() {
        const UserProfileHeader = this.getByName("UserProfileHeader");
        const UserProfileActions = this.getByName("UserProfileActions");
        //const UserProfileHeader = this.getByName("UserProfileActions");

        const Button = this.getByName("Button").default;

        //user profile actions (before profile themes thing)
        after(UserProfileHeader, "default", (ctx, component) => {
            const { props } = component;
            const { children } = props
            if(children === undefined) return;
            const buttons = children[4]?.props?.children;
            if(buttons === undefined) return;

            const callButton = buttons[1];
            if(callButton){
                this.patcher.after(callButton, "type", (ctx: any, component: any) => {
                    const callFunction = component.props.onPress
                    component.props.onPress = () =>{
                        this.yesNoPrompt(this.CALL_PROMPT,callFunction, ()=>{})
                    }
                })
            }

            const vcButton = buttons[2];
            if(vcButton){
                this.patcher.after(vcButton, "type", (ctx: any, component: any) => {
                    const callFunction = component.props.onPress
                    component.props.onPress = () =>{
                        this.yesNoPrompt(this.VIDEO_CALL_PROMPT,callFunction, ()=>{})
                    }
                })
            }

            const friendReqButton = buttons[3];
            if(friendReqButton){
                this.patcher.after(friendReqButton, "type", (ctx: any, component: any) => {
                    const friendReqFunction = component.props.onPress
                    component.props.onPress = () =>{
                        this.yesNoPrompt(this.FRIEND_REQ_PROMPT,friendReqFunction, ()=>{})
                    }
                })
            }
            ctx.result = [component]
        });

        after(UserProfileActions, "default", (ctx,component) => {
            //component.props.children.props.children[1].props.children
            //console.log(component)
            let buttons = component.props?.children?.props?.children[1]?.props?.children
            if(buttons){
                //console.log(buttons);
                for (let i = 0; i < buttons.length; i++) {
                    if(buttons[i]){
                        this.patcher.after(buttons[i], "type", (ctx: any, component: any) => {
                            const callFunction = component.props.onPress

                            if(!component.props.patched){
                                if(component.props.accessibilityHint == Locale.Messages["START_VOICE_CALL"]){
                                    component.props.onPress = () =>{
                                        this.yesNoPrompt(this.CALL_PROMPT,callFunction, ()=>{})
                                    }
                                    component.props.patched = true
                                }
                                if(component.props.accessibilityHint == Locale.Messages["START_VIDEO_CALL"]){
                                    component.props.onPress = () =>{
                                        this.yesNoPrompt(this.VIDEO_CALL_PROMPT,callFunction, ()=>{})
                                    }
                                    component.props.patched = true
                                }
                                if(component.props.accessibilityHint == Locale.Messages["ADD_FRIEND_BUTTON"]){
                                    component.props.onPress = () =>{
                                        this.yesNoPrompt(this.FRIEND_REQ_PROMPT,callFunction, ()=>{})
                                    }
                                    component.props.patched = true
                                }
                            }
                        })
                    }
                }
            }
            
        })

        //Add the confirm dialog to the top bar in DMs
        const HeaderSegment = this.getByName("HeaderSegment");
        this.patcher.after(HeaderSegment, "default", (ctx,component: any) => {
            const originalHeaderRight = component.props.headerRight
            if(component.props.headerRight){
                //may god have mercy on you if you have to read this code
                this.patcher.after(component.props, "headerRight", (ctx,component:any) => { //drop 1 level
                    this.patcher.after(component, "type", (ctx,component,props:any) => { // drop another level 
                        this.patcher.after(component, "type", (ctx,component: any,props: any) => { 
                            //the touchable hitbox *should* be here
                            this.patcher.after(component, "type", (ctx,component: any,props: any) => { 
                                //i lied 💀
                                this.patcher.after(component, "type", (ctx,component: any,props: any) => {
                                    //here
                                    let btns = component.props.children
                                    for (let i = 0; i < btns.length; i++) {
                                        this.patcher.after(btns[i], "type", (ctx: any, component: any) => {
                                            const callFunction = component.props.onPress

                                            if(!component.props.patched){
                                                if(component.props.accessibilityLabel == Locale.Messages["START_VOICE_CALL"]){
                                                    component.props.onPress = () =>{
                                                        this.yesNoPrompt(this.CALL_PROMPT,callFunction, ()=>{})
                                                    }
                                                    component.props.patched = true
                                                }
                                                if(component.props.accessibilityLabel == Locale.Messages["START_VIDEO_CALL"]){
                                                    component.props.onPress = () =>{
                                                        this.yesNoPrompt(this.VIDEO_CALL_PROMPT,callFunction, ()=>{})
                                                    }
                                                    component.props.patched = true
                                                }
                                            }
                                        })
                                    }
                                })
                            })
                        })
                    })
                })
            }
        })

        this.patcher.before(LazyActionSheet, "openLazy", (ctx) => {
            const [component, sheet] = ctx.args;
            if (sheet == "CallTap"){
                component.then(instance => {
                    this.patcher.after(instance, "default", (ctx,component: any)=>{
                        const callSheet = component
                        const callItems = callSheet.props?.children[callSheet.props.children.length - 1]?.props?.children;
                        if(callItems){
                            callItems.forEach(item => {
                                this.patcher.after(item,"type",(ctx,component:any) => {
                                    //console.log(component)//.props.leading.props.source)
                                    //console.log(component.props?.children?.props?.children[0]?.props?.children?.props?.source)
                                    const iconId = component.props?.children?.props?.children[0]?.props?.children?.props?.source
                                    
                                    const originalFunction = component.props.onPress
                                    if(!component.props.patched){
                                        if(iconId == getAssetId("nav_header_connect")){
                                            if(component.props.onPress){
                                                component.props.onPress = () => {
                                                    this.yesNoPrompt(this.CALL_PROMPT,originalFunction, ()=>{})
                                                }
                                                component.props.patched = true
                                            }
                                        }
                                        if(iconId == getAssetId("video")){
                                            if(component.props.onPress){
                                                component.props.onPress = () => {
                                                    this.yesNoPrompt(this.VIDEO_CALL_PROMPT,originalFunction, ()=>{})
                                                }
                                                component.props.patched = true
                                            }
                                        }
                                    }
                                })

                            });
                        }
                    })
                })
            }
        })
    }
}
