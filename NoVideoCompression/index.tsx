import { Plugin } from 'aliucord/entities';
// @ts-ignore
import { getModule, Toasts, React, ReactNative, Dialog, Locale, getByProps, getAll } from 'aliucord/metro';
import { getAssetId } from 'aliucord/utils/getAssetId';
import { after } from "aliucord/utils/patcher";

type FilterOptions = {
    exports?: boolean;
    default?: false;
} | {
    exports?: true;
    default?: true;
};


//--> (new aliucord.api.Patcher()).before(getByProps("createUploadProgressEmbed"),"createUploadProgressEmbed",c=>console.log(c))
//--> (new aliucord.api.Patcher()).before(getByProps("uploadLocalFiles"),"uploadLocalFiles",c=>console.log(c))

export default class NoVideoCompression extends Plugin {
    private getByName(defaultName: string, options?: FilterOptions) {
        return getModule(m => m?.default?.name === defaultName, options);
    }
    public async start() {
        const Messages = getByProps('receiveMessage', 'sendMessage');
        const getChannel = getByProps('getChannel');
        /*this.patcher.before(Messages, 'sendMessage', (ctx) => {
            const [channelId, message] = ctx.args;
            //const channel = getChannel(channelId);
            window.msg = message;
            console.log(message)
        });

        const Uploader = getByProps("uploadLocalFiles")
        this.patcher.after(Uploader,"uploadLocalFiles",(ctx) => {
            //console.log("uploadLocalFiles",ctx.args,ctx.result)
        })

        this.patcher.before(Uploader,"uploadLocalFiles",(ctx) => {
            console.log("beforeUploadLocalFiles",ctx.args,ctx.result)
            console.log(ctx.args[0].items)
            window.uploadthis=ctx.thisObject
            window.uploadargs=ctx.args
            console.log(ctx.thisObject)
            ctx.args[0].items[0].isVideo = false
            ctx.args[0].items[0].item.mimeType = "text/plain"
            ctx.args[0].items[0].item.width = undefined
            ctx.args[0].items[0].item.height = undefined

        })

        this.patcher.after(getByProps("canUseHighVideoUploadQuality"),"canUseHighVideoUploadQuality",(ctx)=>{
            ctx.result = true
        })

        this.patcher.after(getByProps("UploadPlatform"),"default",(ctx)=>{
            console.log("UploadPlatform",ctx.args,ctx.result)
            window.upload2=ctx
        })*/
        //AliuHermes.getBytecode(getByProps("handleUploadProgress").handleFileUploadStart)
        this.patcher.after(getByProps("getCaptionLabel").default,"isVideo",(ctx) =>{
            console.log("isVideo",ctx.args,ctx.result)
        })
        this.patcher.after(getByProps("resolveModeToVideoQualityForFreeUser"),"resolveModeToVideoQualityForFreeUser",(ctx) => {
            console.log("resolveModeToVideoQualityForFreeUser",ctx.args,ctx.result)
        })
        //aliucord.metro.getAll(a => {if(a.isVideo){console.log(a);return true}})

        getAll(a => {
            if(a.isVideo){
                this.patcher.after(a,"isVideo",(ctx) => {
                    console.log("isVideo",ctx.args,ctx.result)
                })
            }
            if(a.getType){
                this.patcher.after(a,"getType",(ctx) => {
                    console.log("getType",ctx.args,ctx.result)
                })
            }
            if(a.getFileInfo){
                this.patcher.after(a,"getFileInfo",(ctx) => {
                    console.log("getFileInfo",ctx.args,ctx.result)
                    ctx.args[0].isVideo = false
                    ctx.args[0].reactNativeFilePrepped = false
                    window.aaa = ctx.result
                    const origResult = ctx.result
                    ctx.result = (async () => {
                        let newResult: any = await origResult
                        newResult.isVideo = false
                        newResult.type = ctx.args[0].item.mimeType
                        newResult.name = ctx.args[0].item.filename
                        //newResult.uri = "file:///data/user/0/com.aliucordrn/cache/compressor/aaaa.txt"
                        newResult.uri = ctx.args[0].item.uri
                        return newResult
                    })()
                })
            }
            return false
        })

        this.patcher.after(getByProps("resolveModeToVideoQualityForFreeUser"),"mediaManager",(ctx) => {
            console.log("mediaManager",ctx.args,ctx.result)
        })

        this.patcher.before(ReactNative.NativeModules.MediaManager,"convertToJPEG",(ctx)=>{
            console.log("convertToJPEG",ctx.args,ctx.result)
        })

        this.patcher.before(getByProps("uploadLocalFiles"),"uploadLocalFiles",(ctx) => {
            //console.log("uploadLocalFiles",ctx.args,ctx.result)
            throw new Error("aaa")
        })
        this.patcher.before(getByProps("stageAttachmentFiles"),"stageAttachmentFiles",(ctx) => {
            console.log("stageAttachmentFiles",ctx.args,ctx.result)
        })
        this.patcher.after(getByProps("stageAttachmentFiles"),"default",(ctx) => {
            console.log("stageAttachmentFiles.default",ctx.args,ctx.result)
        })
        
        /*this.patcher.after(getByProps("getAttachmentFile"),"getAttachmentFile",(ctx) => {
            console.log("getAttachmentFile",ctx.args,ctx.result)
            window.af=ctx.result

            ctx.result = async ()=>{
                return {
                        file:{ 
                            uri: "file:///data/user/0/com.aliucordrn/cache/compressor/aaaa.txt",
                            //type: ctx.args[0].item.mimeType,
                            isVideo: false,
                            isImage: false,
                            name: ctx.args[0].item.filename,
                            spoiler: false,
                            description: null },
                        //uri: ctx.args[0].item.uri,
                        uri: "file:///data/user/0/com.aliucordrn/cache/compressor/aaaa.txt",
                        name: ctx.args[0].item.filename,
                        fileSize: 9927390
                    }
                }
            //AliuFS.writeFile("/data/user/0/com.aliucordrn/cache/compressor/aaaa.txt","uwu")
            //file:///data/user/0/com.aliucordrn/cache/compressor/aaaa.txt
        })*/
        //(new aliucord.api.Patcher()).before(getByProps("uploadLocalFiles"),"uploadLocalFiles",(ctx) => {throw new Error("aaa")})

    }
}
