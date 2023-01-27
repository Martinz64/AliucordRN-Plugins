import { Plugin } from 'aliucord/entities';
// @ts-ignore
import { getModule, Toasts, React, ReactNative, Dialog, Locale, getByProps } from 'aliucord/metro';
import { getAssetId } from 'aliucord/utils/getAssetId';
import { after } from "aliucord/utils/patcher";
import { Button, Text, View } from 'react-native';
import { SizeTag } from './SizeTag';

type FilterOptions = {
    exports?: boolean;
    default?: false;
} | {
    exports?: true;
    default?: true;
};

export default class FileSizeOnPicker extends Plugin {
    private getByName(defaultName: string, options?: FilterOptions) {
        return getModule(m => m?.default?.name === defaultName, options);
    }

    SIZE_CACHE = {}
    static instance: FileSizeOnPicker;
    public async start() {
        FileSizeOnPicker.instance = this;

        this.patcher.after(getByProps("VirtualizedListCellContextProvider"),"VirtualizedListCellContextProvider",(ctx,component:any)=>{
            //console.log("VirtualizedListCellContextProvider",component)
            if(component.props?.children?.props?.children[0]?.type){
                this.patcher.after(component.props.children.props.children[0].type,"type",(ctx,component:any)=>{
                    //console.log("VirtualizedListCellContextProvider.TYPE",component)
                    //window.upload3=component
                    component.props?.children?.forEach(child => {
                        if(child.type)this.patcher.after(child,"type",(ctx,component: any) => {
                            if(!component.props?.patched){
                                //window.upload4=component
                                const imageInfo = component.props?.children[0]?.props?.source
                                if(imageInfo && component.props.children){
                                    if(imageInfo.uri){
                                        component.props.children.push(
                                            <View style={{
                                                position: 'absolute',
                                                opacity: 1,
                                                backgroundColor: 'rgb(55,55,55)',
                                                padding: 4,
                                                paddingLeft: 8,
                                                paddingRight: 8,
                                                top: 4,
                                                left: 4,
                                                borderRadius: 4,
                                            }}>
                                                <SizeTag url={imageInfo.uri} />
                                            </View>
                                        )
                                    }
                                }
                                component.props.patched = true
                            }
                            //window.upload4=component
                        })
                    })

                })
            }
        })
    }
}
