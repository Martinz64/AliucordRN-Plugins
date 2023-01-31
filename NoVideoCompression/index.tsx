import { Plugin } from 'aliucord/entities';
// @ts-ignore
import { getAll, getByProps, Locale } from 'aliucord/metro';
export default class NoVideoCompression extends Plugin {
    public async start() {
        // there has to be a better way to do this
        getAll(a => {
            if(a.getFileInfo){
                this.patcher.after(a,"getFileInfo",(ctx) => {
                    console.log("getFileInfo",ctx.args,ctx.result)
                    const origResult = ctx.result
                    ctx.result = (async () => {
                        let newResult: any = await origResult
                        //newResult.type = ctx.args[0].item.mimeType
                        //newResult.name = ctx.args[0].item.filename
                        newResult.uri = ctx.args[0].item.uri
                        return newResult
                    })()
                })
            }
            return false
        })
        this.patcher.before(getByProps("createUploadProgressEmbed"),"createUploadProgressEmbed",(ctx)=>{
            const embeds = ctx.args[0]
            embeds.forEach(embed => {
                if(embed.name == Locale.Messages["ATTACHMENT_COMPRESSING"]){
                    embed.name = Locale.Messages["ATTACHMENT_PROCESSING_SERVER"]
                }
            });
        })


    }
}
