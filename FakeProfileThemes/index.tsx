import { Plugin } from 'aliucord/entities';
// @ts-ignore
import { getByProps } from 'aliucord/metro';
import { findInReactTree } from 'aliucord/utils';

export default class FakeProfileThemes extends Plugin {
    public async start() {
        const UserProfileStore = getByProps("getUserProfile");
        this.patcher.before(getByProps("ProfileGradientCard"),"ProfileGradientWrapper",(ctx,component:any)=>{
            let usernameComponent = findInReactTree(ctx.args[0],m=>m.type?.name=="UserProfileName");
            let bio = UserProfileStore.getUserProfile(usernameComponent.props?.user?.id).bio;
            let decoded = this.decode(bio);
            if(!decoded) return;
            ctx.args[0].primaryColor = decoded[0];//null
            ctx.args[0].secondaryColor = decoded[1];
        })
    }
    
    /*
    Copied from here:
    https://github.com/Vendicated/Vencord/blob/7c514e4b1dae25f48b20bc6d5f3025c22e231450/src/plugins/fakeProfileThemes.tsx#L52
    */
    decode(bio){
        if (bio == null) return null;
    
        const colorString = bio.match(
            /\u{e005b}\u{e0023}([\u{e0061}-\u{e0066}\u{e0041}-\u{e0046}\u{e0030}-\u{e0039}]+?)\u{e002c}\u{e0023}([\u{e0061}-\u{e0066}\u{e0041}-\u{e0046}\u{e0030}-\u{e0039}]+?)\u{e005d}/u,
        );
        if (colorString != null) {
            const parsed = [...colorString[0]]
                .map(x => String.fromCodePoint(x.codePointAt(0) - 0xe0000))
                .join("");
            const colors = parsed
                .substring(1, parsed.length - 1)
                .split(",")
                .map(x => parseInt(x.replace("#", "0x"), 16));
    
            return colors;
        } else {
            return null;
        }
    }
}
