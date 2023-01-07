import { Plugin } from 'aliucord/entities';
// @ts-ignore
import { getModule, Toasts, React, ReactNative, Dialog, Locale, Forms} from 'aliucord/metro';
const { FormSection, FormSwitch, FormRow } = Forms;
import { getAssetId } from 'aliucord/utils';
import { after } from "aliucord/utils/patcher";
type FilterOptions = {
    exports?: boolean;
    default?: false;
} | {
    exports?: true;
    default?: true;
};

export default class ChatGuard extends Plugin {
    private getByName(defaultName: string, options?: FilterOptions) {
        return getModule(m => m?.default?.name === defaultName, options);
    }

    CHANNEL_IDS = [
        '811255667469582420', // #offtopic
        '811261478875299840', // #plugin-development
        '868419532992172073', // #theme-development
        '865188789542060063', // #related-development
        '811262084968742932', // #core-development

        //'985647046755221575', // testing channel
    ]

    MESSAGE = "PLEASE READ: This is not a support channel, do not ask for help! This is NOT A SUPPORT CHANNEL. Do NOT ask for help about using or installing a plugin or theme here or you will be muted."
    MESSAGE_SHORT = "PLEASE READ: This is not a support channel, do not ask for help!"

    public async start() {
        // @ts-ignore
        const settings = window.Aliucord.settings

        const ChatInputGuard = this.getByName("ChatInputGuard")
        this.patcher.after(ChatInputGuard.default.prototype, "render", (_, component: any) => {
            let chatInput = component.props.children.find(c => c?.props?.accessibilityLabel != undefined)
            const channelId = chatInput?.props?.channel?.id
            if(this.CHANNEL_IDS.includes(channelId+'')){
                component.props.children = [
                    <>
                        {
                            // @ts-ignore
                            settings.get("AcknowlegedNoSupportChannels", false) ? component.props.children :
                        
                            <ReactNative.View
                                style={{
                                    //"backgroundColor": "#36393f",
                                    "borderColor": "#202225",
                                    "borderTopWidth": 0.36363636363636365,
                                    "padding": 6,
                                    "paddingVertical": 8,
                                    "paddingLeft": 4,
                                    "paddingRight": 4
                            }}>
                                <FormRow
                                    label={this.MESSAGE_SHORT}
                                    leading={<FormRow.Icon source={getAssetId("ic_warning_24px")} />}
                                    trailing={FormRow.Arrow}

                                    onPress={()=>{
                                        Dialog.show({
                                            title: "PLEASE READ",
                                            body: this.MESSAGE,
                                            confirmText: "I Understood",
                                            cancelText: "Cancel",
                                            isDismissable: true,
                                            // @ts-ignore
                                            onConfirm: ()=>{settings.set("AcknowlegedNoSupportChannels", true)},
                                            onCancel: ()=>{}
                                        })
                                    }
                                }/>
                            </ReactNative.View>
                        }
                    </>
                ]
            }
        });
    }
}
