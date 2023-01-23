
import { getByProps, React, Forms } from "aliucord/metro";
import { getAssetId } from "aliucord/utils";
import { settings as Config } from "./utils/Settings";

const LazyActionSheet = getByProps("openLazy", "hideActionSheet");
const MediaManager = getByProps("downloadMediaAsset","extractMediaFromAttachment","extractMediaFromEmbed", "extractMediaSourcesFromEmbed")

const { FormRow } = Forms;

export function DownloadRow(props){
    const {attachments} = props

    if(attachments.length){
        return (<>
            { Config.individualDownloadButton ?
            (Config.multipleDownloadButtons ? attachments : attachments.slice(0,1)).map((attachment,i) => {
                return <FormRow
                    key={i}
                    label="Download File"
                    subLabel={attachment.filename}
                    leading={<FormRow.Icon source={getAssetId("ic_download_24px")} />} 
                    onPress={ () => {
                        MediaManager.downloadMediaAsset(attachment.url,0);
                        LazyActionSheet.hideActionSheet("MessageLongPressActionSheet");
                    }}/> 
            }) : null}

            {(Config.downloadAllButton && attachments.length > 1) ? 
                <FormRow
                label="Download All"
                //subLabel={attachments.map(a => a.filename).join(", ")}
                leading={<FormRow.Icon source={getAssetId("ic_download_24px")} />} 
                onPress={ () => {
                    attachments.forEach(attachment => {
                        MediaManager.downloadMediaAsset(attachment.url,0);
                    });
                    LazyActionSheet.hideActionSheet("MessageLongPressActionSheet");
                }}/> : null}
        </>)
    } else {
        return null
    }
    
}
