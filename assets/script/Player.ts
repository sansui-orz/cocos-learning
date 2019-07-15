// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
// const Main = require('Main');
const {ccclass, property} = cc._decorator;

interface IGlobal {
	score: number
};

declare var window: Window & { Global: IGlobal };

window.Global = { score: 0 };

@ccclass
export default class Player extends cc.Component {

    // LIFE-CYCLE CALLBACKS:
    scene: any = null;

    onLoad () {
    }

    start () {

    }

    onCollisionEnter(): void {
        this.scene.GameOver();
    }

    // update (dt) {}
}
