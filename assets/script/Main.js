// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        player: {
            default: null,
            type: cc.Node
        },
        dici: {
            default: null,
            type: cc.Prefab
        },
        playerJumpHeight: 30,
        wallWidth: 80,
        jumpSpeed: 1,
        lock: false,
        diciArray: []
    },

    setInputControl: function() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStartHandler, this);
    },

    onTouchStartHandler: function(event) {
        if (this.lock) return;
        // 通知地刺，鼻涕正在移动
        this.node.emit('player-moving', null);
        this.lock = true;
        const { x, y } = event.touch.getLocation();
        if (x > this.node.width / 2) {
            // 点击右边
            this.moveRight();
        } else {
            // 点击左边
            this.moveLeft();
        }
    },

    // 跳到右边
    moveRight() {
        const finished = cc.callFunc((target, option) => {
            this.judgeDici();
            this.lock = false;
        }, this, null);
        let goRight = undefined;
        if (this.player.angle === 0) {
            goRight = cc.sequence(
                cc.moveTo(this.jumpSpeed, this.node.width / 2 - this.wallWidth, this.player.y),
                finished
            );
            this.player.angle = 180;
            this.player.scaleY = -1;
        } else {
            goRight = cc.sequence(
                cc.moveTo(this.jumpSpeed / 2, this.node.width / 2 - this.wallWidth - 80, this.player.y),
                cc.moveTo(this.jumpSpeed / 2, this.node.width / 2 - this.wallWidth, this.player.y),
                finished
            );
        }
        this.player.runAction(goRight);
    },

    // 跳到左边
    moveLeft() {
        const finished = cc.callFunc((target, option) => {
            this.judgeDici();
            this.lock = false;
        }, this, null);
        let goLeft = undefined;
        if (this.player.angle === 180) {
            goLeft = cc.sequence(
                cc.moveTo(this.jumpSpeed, -this.node.width / 2 + this.wallWidth, this.player.y),
                finished
            );
            this.player.angle = 0;
            this.player.scaleY = 1;
        } else {
            goLeft = cc.sequence(
                cc.moveTo(this.jumpSpeed / 2, -this.node.width / 2 + this.wallWidth + 80, this.player.y),
                cc.moveTo(this.jumpSpeed / 2, -this.node.width / 2 + this.wallWidth, this.player.y),
                finished
            );
        }
        this.player.runAction(goLeft);
    },

    // 新建地刺
    createDici(onBottom) {
        const random = Math.random();
        const dici = cc.instantiate(this.dici);
        this.diciDrection(dici, random);
        if (onBottom) {
            dici.y = -this.node.height / 2 - 200 + 200 * random;
        } else {
            dici.y = 200 - this.diciArray.length * 200;
        }
        this.diciArray.push(dici);
        this.node.addChild(dici);
    },

    // 根据random给地刺设置方向
    diciDrection(node, random) {
        if (random > 0.5) {
            node.x = this.node.width / 2 - this.wallWidth;
            node.angle = 0;
        } else {
            node.angle = 180;
            node.x = -this.node.width / 2 + this.wallWidth;
        }
    },

    // 判断地刺
    judgeDici() {
        const diciArray = this.diciArray;
        // 如果最后一个地刺已经出现在屏幕中
        if (diciArray[diciArray.length - 1].y > -this.node.height / 2 - 50) {
            // 如果这时候最前面的地刺已经在屏幕外了，那么将它复用
            if (diciArray[0].y > this.node.height / 2 + 50) {
                const random = Math.random();
                const newDici = diciArray.shift();
                newDici.y = -this.node.height / 2 - 150 - 50 * random;
                this.diciDrection(newDici, random);
                diciArray.push(newDici);
            } else {
                console.log('新建?');
                // 否则新建一个地刺
                this.createDici(true);
            }
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.setInputControl();
        for (let i = 0; i < 8; i++) {
            this.createDici();
        }
    },

    start () {

    },

    // update (dt) {},
});
