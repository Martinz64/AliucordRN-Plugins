import { Plugin } from 'aliucord/entities';
// @ts-ignore
import { getModule, getByProps, MessageStore, ChannelStore } from 'aliucord/metro';

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
