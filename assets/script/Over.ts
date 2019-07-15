// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

interface IGlobal {
	score: number
};

declare var window: Window & { Global: IGlobal };

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    Btn: cc.Node = null;

    @property(cc.Label)
    scoreLabel: cc.Label = null;

    onLoad () {
        cc.director.preloadScene('Main');
        this.Btn.on('touchstart', function() {
            cc.director.loadScene('Main');
        });
        this.scoreLabel.string = '最终得分：' + window.Global.score;
    }

    // update (dt) {}
}
