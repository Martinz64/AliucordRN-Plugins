import { Plugin } from 'aliucord/entities';
// @ts-ignore
import { getModule, Toasts, React, ReactNative, Dialog, Locale, getByProps, MessageStore, ChannelStore } from 'aliucord/metro';
import { getAssetId } from 'aliucord/utils/getAssetId';
import { after } from "aliucord/utils/patcher";

type FilterOptions = {
    exports?: boolean;
    default?: false;
} | {
    exports?: true;
    default?: true;
};



export default class DoubleTapReply extends Plugin {
    private getByName(defaultName: string, options?: FilterOptions) {
        return getModule(m => m?.default?.name === defaultName, options);
    }
    public async start() {
        const EMOJI_REGEX = /https?:\/\/.*\/emojis\/([0-9]+).(webp|png|gif)\?.*/


        //ReactNative.requireNativeComponent
        /*this.patcher.before(ReactNative,"requireNativeComponent",(ctx) => {
            console.log("requireNativeComponent",ctx.args,ctx.result)
        })*/

        this.patcher.before(getByProps("DCDChat"),"createView",(ctx) => {
            //console.log("createView",ctx.args,ctx.result)
        })

        this.patcher.after(this.getByName("ChatManager"),"default",(ctx) => {
            console.log("ChatManager",ctx.args,ctx.result)
        })

        this.patcher.after(this.getByName("ChatViewConnected"),"default",(ctx) => {
            console.log("ChatViewConnected",ctx.args,ctx.result)
            const component = ctx.result
            this.patcher.after(component,"type",(ctx) => {
                console.log("ChatViewConnected.type",ctx.args,ctx.result)

            })
        })

        const ReplyManager = getByProps("createPendingReply")

        const Chat = this.getByName("Chat")

        let chatTapCount = 0;
        let oldTappedMessage = "";
        let timeoutId;

        Chat.default.defaultProps.onDoubleTapMessage = (arg) => {
            chatTapCount++;
            
            console.log("MessageTap",arg.nativeEvent,chatTapCount)
            timeoutId = setTimeout(()=>{chatTapCount = 0},300);
            if(chatTapCount == 2){
                clearTimeout(timeoutId)
                const nativeEvent = arg.nativeEvent;
                if(oldTappedMessage == nativeEvent.messageId){
                    ReplyManager.createPendingReply({
                        channel: ChannelStore.getChannel(nativeEvent.channelId),
                        message: MessageStore.getMessage(nativeEvent.channelId,nativeEvent.messageId),
                        shouldMention: true
                    })
                }
                chatTapCount = 0
            }
            oldTappedMessage = arg.nativeEvent.messageId;
        }
    }
}
