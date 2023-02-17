import { Plugin } from 'aliucord/entities';
// @ts-ignore
import { getModule, Toasts, React, ReactNative, Dialog, Locale, getByProps, MessageStore, ChannelStore, Styles, Forms } from 'aliucord/metro';
import { getAssetId } from 'aliucord/utils';
import { after } from "aliucord/utils/patcher";
import { Touchable, TouchableNativeFeedback, TouchableOpacity } from 'react-native';
import SettingsPage from './settingsPage';
import getStyles from './styles';
import { settings } from './utils/Settings';

const {View,Text,Pressable} = ReactNative
const { FormIcon, FormRow } = Forms

type FilterOptions = {
    exports?: boolean;
    default?: false;
} | {
    exports?: true;
    default?: true;
};




export default class DMCategories extends Plugin {
    public getByName(defaultName: string, options?: FilterOptions) {
        return getModule(m => m?.default?.name === defaultName, options);
    }
    
    MARKS = {
        //DMLIST_PATCHED: "DMLIST_PATCHED",
        //DMLIST_SEPARATOR: "DMLIST_SEPARATOR"
        DMLIST_PATCHED: '969292696969695552', //'111',
        DMLIST_SEPARATOR: '966992969695725566'
    }
    
    public static instance: DMCategories;

    public async start() {
        DMCategories.instance = this;

        const Button = this.getByName("Button", { default: false }).default;
        let updateDMList;

        let styles = getStyles();
        

        /*let categories = [
            {
                id: '24892',
                name: "aaa",
                items: [
                    '633314054731071491',
                    '993648979910860851',
                    '1062688000225587250'
                ],
                open: true
            }
        ]*/

        const ConnectedPrivateChannels = this.getByName("ConnectedPrivateChannels")
        this.patcher.after(ConnectedPrivateChannels,"default",(ctx,component,props)=>{
            const [, forceUpdate] = React.useReducer(x => x = !x, false);
            updateDMList = forceUpdate

            let firstRow;
            let hasMessageRequestOffset = false;

            this.patcher.after(component,"type",(ctx,component: any) => {
                //console.log("ConnectedPrivateChannels",component)
                window.cpc = component

                this.patcher.after(component,"renderRow",(ctx) => {
                    //console.log("renderRow",component,ctx.args)
                    window.sect = ctx.result
                    window.secta = ctx.args
                    let index=ctx.args[1]

                    if(index == 0){
                        //firstRow = ctx.result
                        if(ctx.result.type?.name =="MessageRequestRow"){
                            hasMessageRequestOffset = true;
                            return ctx.result
                        }
                    }
                    if(hasMessageRequestOffset){
                        index -=1;
                    }

                    const categories = settings.getCategories()

                    const id = component.props?.privateChannelIds[index]
                    const categoryIndex = categories.findIndex(c => c.id == id)
                    const category = categories[categoryIndex];

                    if(index < 6){
                        console.log(index,id,ctx.result,ctx.args)
                    }
                    
                    
                    //console.log(id,category)
                    if(category){
                        /*ctx.result =*/ return (
                            <TouchableNativeFeedback
                                style={{
                                    height:32
                                }}
                                onPress={()=>{
                                    categories[categoryIndex].open = !categories[categoryIndex].open
                                    forceUpdate();
                                    settings.setCategories(categories)
                            }}>
                                <View style={styles.container}>
                                    <View style={styles.marginBox}>
                                        <View
                                        style={styles.categoryHeader}>
                                            {!category.open ? <FormIcon 
                                                source={getAssetId('ic_table_arrow_up')} 
                                                color={styles.separator.backgroundColor}
                                                style={styles.icon}
                                            /> : null}
                                            
                                            <Text style={styles.text}>{category.name}</Text>
                                        </View>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                        )
                    }
                    if(id == this.MARKS.DMLIST_PATCHED){
                        return null
                    }
                    if(id == this.MARKS.DMLIST_SEPARATOR){
                        /*ctx.result*/ return (
                            <View style={[styles.marginBox,{height: 8}]}>
                                <View style={styles.separator}></View>
                            </View>
                        )
                    }
                })

                this.patcher.after(component,"getRowHeight",(ctx) => {
                    console.log("getRowHeight",ctx.args,ctx.result)
                    const categories = settings.getCategories()

                    let index=ctx.args[1]

                    //please kill me
                    if(index == 0 && hasMessageRequestOffset){
                        //return ctx.result;
                    }
                    if(hasMessageRequestOffset){
                        //index -=1;
                    }

                    const id = component.props?.privateChannelIds[index]
                    const category = categories.find(c => c.id == id)
                    if(category){
                        //ctx.result = 32
                        //return 32
                    }
                    if(id == this.MARKS.DMLIST_SEPARATOR){
                        //ctx.result = 8
                        //return 32
                    }
                })

                /*this.patcher.after(component,"getRowHeightWithoutPadding",(ctx) => {
                    //console.log("getRowHeight",ctx.args,ctx.result)
                    const categories = settings.getCategories()

                    let index=ctx.args[1]
                    //please end my misery
                    if(index == 0 && hasMessageRequestOffset){
                        return ctx.result;
                    }
                    if(hasMessageRequestOffset){
                        index -=1;
                    }
                    const id = component.props?.privateChannelIds[index]
                    const category = categories.find(c => c.id == id)
                    if(category){
                        ctx.result = 32
                    }
                    if(id == this.MARKS.DMLIST_SEPARATOR){
                        ctx.result = 8
                    }
                })*/

                this.patcher.before(component,"render",(ctx:any) => {
                    //console.log("render",ctx.thisObject)

                    //const component = ctx.thisObject
                    const dm_list = component.props.privateChannelIds
                    const selectedChannel = component.props.selectedChannelId

                    const categories = settings.getCategories()

                    if(!dm_list.includes(this.MARKS.DMLIST_PATCHED)){
                        let new_dm_list:any = []
                        let in_category:any = []
                        dm_list.forEach((id:any) => {
                            if(!categories.find(c => c.id == id)){
                                //console.log("id: ",id)
                                categories.forEach((cat:any) => {
                                    if(cat.items.find(i => i==id)){
                                        //console.log("category includes id: ",id)
                                        //add item to list
                                        //create header if not present
                                        if(!new_dm_list.includes(cat.id)){
                                            new_dm_list.push(cat.id)
                                            
                                        }
                                        if(cat.open || selectedChannel == id){
                                            new_dm_list.push(id)
                                        }
                                        in_category.push(id)

                                    }
                                })
                            }
    
                        })
                        new_dm_list.push(this.MARKS.DMLIST_SEPARATOR)
                        new_dm_list = new_dm_list.concat(dm_list.filter(it => !in_category.includes(it)))
                        new_dm_list.push(this.MARKS.DMLIST_PATCHED)
                        component.props.oldPrivateChannelIds = component.props.privateChannelIds
                        component.props.privateChannelIds = new_dm_list
                    }
                    

                    
                })
            })
            
            
        })


        // dm sheet
        const LazyActionSheet = getByProps("openLazy", "hideActionSheet");
        this.patcher.before(LazyActionSheet, "openLazy", (ctx) => {
            const [component, sheet] = ctx.args;
            
            //console.log(sheet)
            /*Emoji Overview*/
            if (sheet.startsWith("ChannelLongPress-")){
                component.then(instance => {
                    const unpatch1 = this.patcher.after(instance, "default", (_, component: any) => {
                        unpatch1()
                        const unpatch2 = this.patcher.after(component,"type",(_,component:any) => {
                            unpatch2()

                            const categories = settings.getCategories()

                            //window.sheet = component
                            //console.log(component)
                            //console.log(component.props.children[1])
                            const channelId = sheet.split("-")[sheet.split("-").length-1]
                            //component.props.children.push(<View>
                            //component.props.children[1].props.children.props.children.
                            component.props?.children[1]?.props?.children?.props?.children[0]?.push(
                                <View style={styles.sheetMargin}>
                                    <View style={styles.sheetInner}>
                                        <FormRow
                                            label="Add to DM Category"
                                            trailing={                                
                                            <View style={styles.categorySelectionButtons}>
                                                <View style={styles.categorySelectionButtonsItem}>
                                                    <Button
                                                        key="category"
                                                        text="None"
                                                        size="small"
                                                        style={styles.categorySelectionButton}
                                                        onPress={()=>{
                                                            const categories = settings.getCategories()
                                                            const category = categories.find(cat => cat.items.includes(channelId))
                                                            if(category){
                                                                const itemIndex = category?.items.indexOf(channelId)
                                                                category?.items.splice(itemIndex,1)
                                                            }
                                                            if(updateDMList)updateDMList()
                                                            LazyActionSheet.hideActionSheet(sheet);
                                                            settings.setCategories(categories)
                                                        }}
                                                        renderIcon={
                                                            () => !categories.find(c => c.items.includes(channelId)) ?
                                                            <FormRow.Icon source={getAssetId("checked")} style={styles.checkIcon} /> : null
                                                        }
                                                        //color="secondary"
                                                    />
                                                </View>
                                                {categories.map(cat => {
                                                    return(
                                                        <View style={styles.categorySelectionButtonsItem}>
                                                            <Button
                                                            key="category"
                                                            text={cat.name}
                                                            size="small"
                                                            style={styles.categorySelectionButton}
                                                            onPress={()=>{
                                                                const categories = settings.getCategories()
                                                                const category = categories.find(c => c.items.includes(channelId))
                                                                if(category){
                                                                    const itemIndex = category?.items.indexOf(channelId)
                                                                    category?.items.splice(itemIndex,1)
                                                                }

                                                                const categoryToAdd = categories.find(c => c.id == cat.id)
                                                                categoryToAdd?.items.push(channelId)
                                                                if(updateDMList)updateDMList()
                                                                LazyActionSheet.hideActionSheet(sheet);
                                                                settings.setCategories(categories)
                                                            }}
                                                            renderIcon={
                                                                () => cat.items.includes(channelId) ?
                                                                <FormRow.Icon source={getAssetId("checked")} style={styles.checkIcon} /> : null
                                                            }
                                                            //color="secondary"
                                                            />
                                                        </View>)
                                                })}

                                            </View>
                                        }/>
                                    </View>
                                </View>
                            )
                        })
                    })
                })
            }
        })
    }
    public getSettingsPage() {
        return <SettingsPage />;
    }
    
}
