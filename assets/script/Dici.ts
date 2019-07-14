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


@ccclass
export default class Dici extends cc.Component {
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.parent.on('player-moving', this.onTouchStartHandler, this);
    }

    onTouchStartHandler(): void {
        this.node.runAction(cc.moveBy(0.3, 0, 200));
    }

    start () {

    }

    // update(): void {
        // const player: cc.Node = this.getComponent('Player');
    // }
}
