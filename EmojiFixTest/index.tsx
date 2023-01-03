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

export default class EmojiFixTest extends Plugin {
    private getByName(defaultName: string, options?: FilterOptions) {
        return getModule(m => m?.default?.name === defaultName, options);
    }

   

    public async start() {
        const UserProfileHeader = this.getByName("UserProfileHeader");
        const Button = this.getByName("Button").default;


        after(UserProfileHeader, "default", (ctx, component) => {
            
            ctx.result = [component]
        });
        const chatManager = ReactNative.NativeModules.DCDChatManager
        this.patcher.before(chatManager, "updateRows", (ctx) => {
            //console.log("OWO",ctx.args)
            const json = ctx.args[1]
            let messages = JSON.parse(json)
            let newMessages: any = []
            for (let i = 0; i < messages.length; i++) {
                let msg = messages[i];
                //console.log(msg)
                try{
                    if(msg.type == 1){
                        //msg.message.username = msg.message.username + " 🤑"+i
                        

                        /*

                        if(embeds){
                            for (let j = 0; j < embeds.length; j++) {
                                const embed = embeds[j];
                                if(embed.type == 'image'){
                                    const regex = /https?:\/\/(:?cdn\.)?discord.*\.com\/emojis\/([0-9]+).(webp|png|gif)/
                                    if(embed.url){
                                        console.log(embed.url)
                                        let matches:any = regex.exec(embed.url)
                                        let [_, __, id, format] = matches
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
                            for (let j = 0; j < embeds.length; j++) {
                                const regex = /https?:\/\/(:?cdn\.)?discord.*\.com\/emojis\/([0-9]+).(webp|png|gif)/
                                if(embeds[j].url){
                                    if(regex.exec(embeds[j].url)?.length){
                                        //delete embeds[j]
                                    }
                                }
                            }
                            
                        }

                        */
                        let messageHasText = false
                        const regex = /https?:\/\/(:?cdn\.)?discord.*\.com\/emojis\/([0-9]+).(webp|png|gif)/
                        console.log("CONTENT",msg.message.content)
                        if(msg.message.content){
                            for (let j = 0; j < msg.message.content.length; j++) {
                                messageHasText = true
                                let node = msg.message.content[j];
                                console.log("NODE",node)
                                if(node.type == "link"){
                                    const linkAddress = node.target
                                    if(regex.exec(linkAddress)?.length){ //url is an emoji url
                                        let matches:any = regex.exec(linkAddress)
                                        let [_, __, id, format] = matches
                                        
                                        //this code should not exist
                                        node.type = 'customEmoji'
                                        node.id = id
                                        node.src = 'https://cdn.discordapp.com/emojis/'+id+'.'+format
                                        node.frozenSrc = 'https://cdn.discordapp.com/emojis/'+id+'.'+format
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
                                        const regex = /https?:\/\/(:?cdn\.)?discord.*\.com\/emojis\/([0-9]+).(webp|png|gif)/
                                        if(embed.url){
                                            console.log(embed.url)
                                            let matches:any = regex.exec(embed.url)
                                            let [_, __, id, format] = matches
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

                            for (let j = 0; j < embeds.length; j++) {
                                const regex = /https?:\/\/(:?cdn\.)?discord.*\.com\/emojis\/([0-9]+).(webp|png|gif)/
                                if(embeds[j].url){
                                    if(regex.exec(embeds[j].url)?.length){
                                        //delete embeds[j]
                                        embeds.splice(j,1)
                                    }
                                }
                            }

                        }



                    }
                } catch(e){}
                newMessages.push(msg)
                //console.log(msg)
            }
            ctx.args[1] = JSON.stringify(newMessages)

        })
    }
}
