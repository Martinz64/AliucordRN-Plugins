import { Plugin } from "aliucord/entities";
// @ts-ignore
import { getByDisplayName } from "aliucord/metro";

export default class NoRipple extends Plugin {

    public start() {
        let isScrolling = false

        this.patcher.before(getByDisplayName("Pressable").type,"render", (ctx) => {
            //console.log("Pressable",ctx.args)
            ctx.args[0].unstable_pressDelay = 100
            ctx.args[0].delayPressIn = 100
            if(isScrolling){
                //ctx.args[0].android_ripple = false
                /*ctx.args[0].style = {
                    backgroundColor: "#ff0000"
                }*/
            }
        })

        /*this.patcher.before(getByDisplayName("ScrollView"),"render", (ctx) => {
            console.log("ScrollView",ctx.args,ctx.result)
            const [, forceUpdate] = React.useReducer(x => x = !x, false);


            ctx.args[0].onScrollBeginDrag = () =>{
                //console.log("begin drag")
                isScrolling = true
                forceUpdate()
            }
            ctx.args[0].onScrollEndDrag = () =>{
                //console.log("end drag")
                //setTimeout(() => {
                    isScrolling = false
                    forceUpdate()
                //}, 100);
                
            }
            
            ctx.args[0].onMomentumScrollEnd = () =>{
                //console.log("end drag")
                //setTimeout(() => {
                    isScrolling = false
                    forceUpdate()
                //}, 100);
                
            }

            ctx.args[0].onMomentumScrollBegin = () =>{
                isScrolling = true
                forceUpdate()
            }
            
        })*/


    }

    public stop() {
    }
}