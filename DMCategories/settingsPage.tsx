import { Forms, getByProps, React, ReactNative } from "aliucord/metro";
import { getAssetId } from "aliucord/utils";
import { View } from "react-native";
import DMCategories from ".";
import getStyles from "./styles";
import styles from "./styles";
import { makeid } from "./utils";

const { ScrollView } = ReactNative;

const { FormRow, FormSection, FormSwitch, FormInput, FormDivider } = Forms;
import { getSettings, settings } from "./utils/Settings";

export default function SettingsPage() {
    const checkIcon = getAssetId("checked");
    const navigation = getByProps("NavigationContainer").useNavigation();
    const { get, set } = getSettings();
    const categories = settings.getCategories()
    const styles = getStyles()
    const Button = DMCategories.instance.getByName("Button", { default: false }).default;
    const [, forceUpdate] = React.useReducer(x => x = !x, false);

    let newName = "";

    return (<>
        {/*// @ts-ignore */}
        <ScrollView>
            <FormSection title="Categories" android_noDivider={true}>
                {categories.map(cat => {
                    return (
                        <FormRow
                            label={
                                <FormInput
                                    title="Name"
                                    value={cat.name}
                                    onChange={v => {
                                        let categories = settings.getCategories()
                                        const index = categories.findIndex(i => i.id == cat.id)
                                        categories[index].name = v
                                        settings.setCategories(categories)
                                        forceUpdate()
                                    }}
                                />
                            }
                            trailing={
                                <View style={styles.categorySelectionButtonsItem}>
                                    <Button
                                        key="category"
                                        text="Delete"
                                        size="small"
                                        onPress={()=>{
                                            let categories = settings.getCategories()
                                            const index = categories.findIndex(c => c.id == cat.id)
                                            categories.splice(index,1)
                                            settings.setCategories(categories)
                                            forceUpdate()
                                        }}
                                        color="red"
                                    />
                                </View>
                            }/>
                    )
                })}
            </FormSection>

            <FormSection title="Add category">
                <FormRow
                label={
                    <FormInput
                        title="Category name"
                        value=""
                        onChange={v => {
                            newName = v
                        }}
                    />
                }
                trailing={
                    <Button
                        key="add"
                        text="Add"
                        size="small"
                        style={styles.categorySelectionButton}
                        onPress={()=>{
                            let categories = settings.getCategories()
                            if(newName){
                                if(!categories.find(i => i.name == newName)){
                                    categories.push({
                                        id: makeid(8),
                                        name: newName,
                                        items: [],
                                        open: true
                                    })
                                }
                            }
                            settings.setCategories(categories)
                            forceUpdate()
                        }}
                    />
                }/>
            </FormSection>
        </ScrollView>
    </>)
}

declare const aliucord: any;
