import { Plugin } from 'aliucord/entities';
// @ts-ignore
import { getModule, Toasts, React, ReactNative, Dialog, Locale } from 'aliucord/metro';
import { getAssetId } from 'aliucord/utils/getAssetId';
import { after } from "aliucord/utils/patcher";

type FilterOptions = {
    exports?: boolean;
    default?: false;
} | {
    exports?: true;
    default?: true;
};

export default class EmojiFix extends Plugin {
    private getByName(defaultName: string, options?: FilterOptions) {
        return getModule(m => m?.default?.name === defaultName, options);
    }
    public async start() {
        const EMOJI_REGEX = /https?:\/\/.*\/emojis\/([0-9]+).(webp|png|gif)\?.*/
        const chatManager = ReactNative.NativeModules.DCDChatManager
        this.patcher.before(chatManager, "updateRows", (ctx) => {
            //console.log("OWO",ctx.args)
            const json = ctx.args[1]
            let messages = JSON.parse(json)
            let newMessages: any = []
            for (let i = 0; i < messages.length; i++) {
                let msg = messages[i];
                try{
                    if(msg.type == 1){
                        let messageHasText = false
                        if(msg.message.content){
                            for (let j = 0; j < msg.message.content.length; j++) {
                                messageHasText = true
                                let node = msg.message.content[j];
                                //console.log("NODE",node)
                                if(node.type == "link"){
                                    const linkAddress = node.target
                                    if(EMOJI_REGEX.exec(linkAddress)?.length){ //url is an emoji url
                                        let matches:any = EMOJI_REGEX.exec(linkAddress)
                                        let [_, id, format] = matches
                                        
                                        if(format == "gif" ){
                                            msg.message.animateEmoji = true;
                                        }

                                        //this code should not exist
                                        node.type = 'customEmoji'
                                        node.id = id
                                        node.src = 'https://cdn.discordapp.com/emojis/'+id+'.'+format+'?size=160'
                                        node.frozenSrc = 'https://cdn.discordapp.com/emojis/'+id+'.'+format+'?size=160'
                                        if(format =="gif"){
                                            node.frozenSrc = 'https://cdn.discordapp.com/emojis/'+id+'.webp?size=160'
                                        }
                                        node.alt = "unknown"
                                    }
                                }
                            }
                        }

                        let embeds = msg.message.embeds
                        if(embeds){
                            // if there's no content, go from the embeds
                            if(!messageHasText){
                                for (let j = 0; j < embeds.length; j++) {
                                    const embed = embeds[j];
                                    if(embed.type == 'image'){
                                        if(embed.url){
                                            //console.log(embed.url)
                                            let matches:any = EMOJI_REGEX.exec(embed.url)
                                            let [_, id, format] = matches
                                            if(format == "gif"){
                                                msg.message.animateEmoji = true;
                                                msg.message.content.push({
                                                    id: id,
                                                    alt: 'unknown',
                                                    src: 'https://cdn.discordapp.com/emojis/'+id+'.'+format+'?size=160',
                                                    frozenSrc: 'https://cdn.discordapp.com/emojis/'+id+'.webp?size=160',
                                                    jumboable: true,
                                                    type: 'customEmoji'
                                                })
                                            } else {
                                                msg.message.content.push({
                                                    id: id,
                                                    alt: 'unknown',
                                                    src: 'https://cdn.discordapp.com/emojis/'+id+'.'+format,
                                                    frozenSrc: 'https://cdn.discordapp.com/emojis/'+id+'.'+format,
                                                    jumboable: true,
                                                    type: 'customEmoji'
                                                })
                                            }
                                        }
                                    }
                                }
                            }
                            
                            let finalEmbeds = embeds.slice(0);
                            embeds.forEach(embed=>{
                                if(embed.url){
                                    if(EMOJI_REGEX.exec(embed.url)?.length){
                                        const embedIndex = finalEmbeds.findIndex(e => e.url == embed.url)
                                        finalEmbeds.splice(embedIndex,1)
                                    }
                                }
                            })
                            msg.message.embeds = finalEmbeds

                        }



                    }
                } catch(e){}
                newMessages.push(msg)
            }
            //console.log(newMessages)
            ctx.args[1] = JSON.stringify(newMessages)

        })
    }
}
