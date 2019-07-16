const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    startBtn: cc.Node = null;

    onLoad() {
      cc.director.preloadScene('Main');
      this.startBtn.on('touchstart', function() {
        cc.director.loadScene('Main');
      });
      const action = cc.repeatForever(
        cc.sequence(
          cc.scaleTo(0.5, 0.8, 1),
          cc.scaleTo(0.5, 0.9, 0.8)
        ));
      this.startBtn.runAction(action);
    }
}
