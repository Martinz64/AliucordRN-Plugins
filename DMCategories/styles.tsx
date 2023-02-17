import { Styles } from 'aliucord/metro';

export default function getStyles(){
    return Styles.createThemedStyleSheet({
        container:{
            width: '100%',
            height: '100%'
        },
        //height = 8
        separator:{
            width: '100%',
            //height: 4,
            height: 2,
            backgroundColor: Styles.ThemeColorMap.TEXT_MUTED,
            /*marginTop: 2,
            marginBottom: 2,*/
            borderRadius: 2,

        },
        text:{
            color: Styles.ThemeColorMap.TEXT_MUTED,
            paddingLeft: 0,
        },
        
        marginBox:{
            marginLeft: 16,
            marginRight: 16,
            /*marginLeft: 32,
            marginRight: 32*/
            marginTop: 2,
            marginBottom: 2,
        },
        icon:{
            width: 8,
            height: 8,
            marginRight: 4,
        },
        categoryHeader:{
            /*marginTop: 2,
            marginBottom: 2,*/
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
        },

        sheetMargin:{
            paddingTop: 16,
            paddingHorizontal: 16,
        },
        sheetInner:{
            backgroundColor: Styles.ThemeColorMap.BACKGROUND_TERTIARY,
            borderRadius: 4,
            overflow: "hidden",
        },
        categorySelectionButtons:{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
        },
        categorySelectionButtonsItem:{
            paddingRight: 8,
        },
        categorySelectionButton:{
            paddingHorizontal: 16,
            backgroundColor: Styles.ThemeColorMap.BACKGROUND_SECONDARY,
        },
        checkIcon:{
            color: Styles.ThemeColorMap.TEXT_MUTED,
            paddingLeft: 0,
            width: 16,
            height: 16,
            marginRight: 4,
        }
    })
}