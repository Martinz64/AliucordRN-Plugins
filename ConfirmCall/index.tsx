import { Plugin } from 'aliucord/entities';
// @ts-ignore
import { getModule, getByProps, getAll, Toasts, React, ReactNative, Dialog, Locale, FormRow } from 'aliucord/metro';
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

    PROFILE_ACTIONS = true
    DM_BAR = true
    FRIENDS_LIST = true

    public async start() {
        const UserProfileHeader = this.getByName("UserProfileHeader");
        const UserProfileActions = this.getByName("UserProfileActions");
        //const UserProfileHeader = this.getByName("UserProfileActions");

        const Button = this.getByName("Button").default;

        //user profile actions (before profile themes thing)
        if(this.PROFILE_ACTIONS)after(UserProfileHeader, "default", (ctx, component) => {
            const { props } = component;
            const { children } = props
            if(children === undefined) return;
            const buttons = children[4]?.props?.children;
            if(buttons === undefined) return;

            const callButton = buttons[1];
            if(callButton){
                if(callButton.type){
                    this.patcher.after(callButton, "type", (ctx: any, component: any) => {
                        const callFunction = component.props.onPress
                        component.props.onPress = () =>{
                            this.yesNoPrompt(this.CALL_PROMPT,callFunction, ()=>{})
                        }
                    })
                }
            }

            const vcButton = buttons[2];
            if(vcButton){
                if(vcButton.type){
                    this.patcher.after(vcButton, "type", (ctx: any, component: any) => {
                        const callFunction = component.props.onPress
                        component.props.onPress = () =>{
                            this.yesNoPrompt(this.VIDEO_CALL_PROMPT,callFunction, ()=>{})
                        }
                    })
                }
            }

            const friendReqButton = buttons[3];
            if(friendReqButton){
                if(friendReqButton.type){
                    this.patcher.after(friendReqButton, "type", (ctx: any, component: any) => {
                        const friendReqFunction = component.props.onPress
                        component.props.onPress = () =>{
                            this.yesNoPrompt(this.FRIEND_REQ_PROMPT,friendReqFunction, ()=>{})
                        }
                    })
                }
            }
            ctx.result = [component]
        });

        if(this.PROFILE_ACTIONS)after(UserProfileActions, "default", (ctx,component) => {
            //component.props.children.props.children[1].props.children
            //console.log(component)
            let buttons = component.props?.children?.props?.children[1]?.props?.children
            if(buttons){
                //console.log(buttons);
                for (let i = 0; i < buttons.length; i++) {
                    if(buttons[i]){
                        if(buttons[i].type)this.patcher.after(buttons[i], "type", (ctx: any, component: any) => {
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
        try{
            if(this.DM_BAR)this.patcher.after(HeaderSegment, "default", (ctx,component: any) => {
                const originalHeaderRight = component.props.headerRight
                if(component.props.headerRight){
                    //may god have mercy on you if you have to read this code
                    this.patcher.after(component.props, "headerRight", (ctx,component:any) => { //drop 1 level
                        if(component.type)this.patcher.after(component, "type", (ctx,component:any,props:any) => { // drop another level 
                            if(component.type)this.patcher.after(component, "type", (ctx,component: any,props: any) => { 
                                //the touchable hitbox *should* be here
                                if(component.type)this.patcher.after(component, "type", (ctx,component: any,props: any) => { 
                                    //i lied 💀
                                    if(component.type)this.patcher.after(component, "type", (ctx,component: any,props: any) => {
                                        //here
                                        let btns = component.props.children
                                        for (let i = 0; i < btns.length; i++) {
                                            if(btns[i].type)this.patcher.after(btns[i], "type", (ctx: any, component: any) => {
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
        } catch(e){}

        this.patcher.before(LazyActionSheet, "openLazy", (ctx) => {
            const [component, sheet] = ctx.args;
            if (sheet == "CallTap"){
                component.then(instance => {
                    this.patcher.after(instance, "default", (ctx,component: any)=>{
                        const callSheet = component
                        const callItems = callSheet.props?.children[callSheet.props.children.length - 1]?.props?.children;
                        if(callItems){
                            callItems.forEach(item => {
                                if(item.type)this.patcher.after(item,"type",(ctx,component:any) => {
                                    //console.log(component)//.props.leading.props.source)
                                    //console.log(component.props?.children?.props?.children[0]?.props?.children?.props?.source)
                                    const iconId = component.props?.children?.props?.children[0]?.props?.children?.props?.source
                                    
                                    const originalFunction = component.props?.onPress
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

        //this.patcher.after(FriendRow, "type", (ctx,component) => {console.log(component);window.friends=component})
        //sorry ;-;
        const MainTabs = getAll(m => m.type?.name == "MainTabs")
        if(this.FRIENDS_LIST)this.patcher.before(MainTabs, "type", (ctx,component) => {
            //console.log("MainTabs",component)

            let FriendRow:any = getAll(m => m.type?.name == "FriendRow")
            if(!FriendRow.patched){
                FriendRow.patched = true;
                //console.log("friendRow",FriendRow)
                this.patcher.after(FriendRow, "type", (ctx,component:any) => {
                    //console.log(component)
                    //window.friends=component

                    //⛏ drill down the component tree
                    //friends.props.children[0].props.children.
                    if(component.props?.children[0]?.props?.children){
                        let bar = component.props?.children[0]?.props?.children;
                        let buttons = bar[bar.length - 1]?.props?.children
                        if(buttons){
                            buttons.forEach(b => {
                                //console.log("btn")
                                this.patcher.after(b,"type", (ctx,component:any,props:any) => {
                                    /*console.log("notpatched")
                                    console.log("src", props.source)
                                    window.btn = component
                                    window.btn2 = props*/
                                    //btn.props.children.props
                                    if(props.source == getAssetId("Audio")){
                                        if(!component.props?.children?.props?.patched){
                                            const callFunction = component.props.children.props.onPress;
                                            component.props.children.props.onPress = () => {
                                                this.promptCall(callFunction);
                                            }
                                            component.props.children.props.patched = true
                                        }
                                    }
                                })


                                
                                //getAssetId("nav_header_connect")
                                
                            });
                        }
                    }
                })
            }
        })

        const Navigator = this.getByName("Navigator");
        this.patcher.before(Navigator, "default", (ctx,component) => {
            //console.log("Navigator",component)
        })
    }

    private promptCall(callFunction:any) {
        this.yesNoPrompt(this.CALL_PROMPT,callFunction, ()=>{})
    }
}
