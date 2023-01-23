import { Forms, getByProps, React, ReactNative } from "aliucord/metro";
import { getAssetId } from "aliucord/utils";
import QuickDownload from ".";

const { ScrollView } = ReactNative;

const { FormRow, FormSection, FormSwitch, FormInput, FormDivider } = Forms;
import { getSettings } from "./utils/Settings";

export default function SettingsPage() {
    const checkIcon = getAssetId("checked");
    const navigation = getByProps("NavigationContainer").useNavigation();
    const { get, set } = getSettings();
    //const { get, set } = QuickDownload.instance.settings;

    return (<>
        {/*// @ts-ignore */}
        <ScrollView>
            <FormSection title="QuickDownload Settings" android_noDivider={true}>
                <FormRow
                    label="Individual download button"
                    subLabel="Show a download button for each attachment"
                    trailing={<FormSwitch 
                        value={get("individualDownloadButton",true)}
                        onValueChange={value => {
                            set("individualDownloadButton",value)
                        }}
                    />}
                />

                <FormRow
                    label="Only show for first attachment"
                    subLabel="Only show download button for the first attachment"
                    trailing={<FormSwitch 
                        value={!get("multipleDownloadButtons",true)}
                        onValueChange={value => {
                            set("multipleDownloadButtons",!value)
                        }}
                    />}
                    disabled={!get("individualDownloadButton",true)}
                />

                <FormRow
                    label="Download all button"
                    subLabel="Show a button to download all attachments in a message"
                    trailing={<FormSwitch 
                        value={get("downloadAllButton",true)}
                        onValueChange={value => {
                            set("downloadAllButton",value)
                        }}
                    />}
                />

            </FormSection>
        </ScrollView>
    </>)
}