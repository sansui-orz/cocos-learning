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
export default class Main extends cc.Component {

    @property(cc.Node)
    player: cc.Node = null;

    @property(cc.Prefab)
    dici: cc.Prefab = null;

	@property
	private playerJumpHeight: number = 30;

	@property
	private wallWidth: number = 80;

	@property
	private jumpSpeed: number = 0.3;

	// 地刺后期可以改成对象池的形式
	@property
	private diciArray: cc.Node[] = [];

	@property
	private lock: boolean = false;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
    	this.setInputControl();
    	for (let i = 0; i < 8; i++) {
    		this.createDici(false);
    	}

    	// 开启碰撞检测
    	const manager: cc.CollisionManager = cc.director.getCollisionManager();
    	manager.enabled = true;
    	manager.enabledDebugDraw = true; // 开启 debug 绘制
    	manager.enabledDrawBoundingBox = true; // 开启碰撞描边
    }

    setInputControl(): void {
    	this.node.on('touchstart', this.onTouchStartHandler, this);
    }

    onTouchStartHandler(event: cc.Event.EventTouch): void {
    	if (this.lock) return;

    	this.node.emit('player-moving', null);
    	this.lock = true;
    	const { x, y } = event.touch.getLocation();
    	if (<number>x > this.node.width / 2) {
    		this.moveRight();
    	} else {
    		this.moveLeft();
    	}
    }

    moveRight(): void {
    	const finished: cc.ActionInstant = cc.callFunc(() => {
    		this.judgeDici();
    		this.lock = false;
    	}, this, null);
    	let goRight: cc.Action = undefined;
    	if  (<number>this.player.angle === 0) {
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
    }

    moveLeft() {
    	const finished: cc.ActionInstant = cc.callFunc(() => {
    		this.judgeDici();
    		this.lock = false;
    	}, this, null);
    	let goLeft: cc.Action = undefined;
    	if (<number>this.player.angle === 180) {
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
    }

    createDici(onBottom: boolean): void {
    	const random: number = Math.random();
    	const dici: cc.Node = cc.instantiate(this.dici);
    	this.diciDrection(dici, random);
    	if (onBottom) {
    		dici.y = -this.node.height / 2 - 200 + 200 * random;
    	} else {
            dici.y = 200 - this.diciArray.length * 200;
    	}
    	this.diciArray.push(dici);
    	this.node.addChild(dici);
    }

    diciDrection(node: cc.Node, random: number): void {
    	if (random > 0.5) {
            node.x = this.node.width / 2 - this.wallWidth;
            node.angle = 0;
    	} else {
    		node.angle = 180;
            node.x = -this.node.width / 2 + this.wallWidth;
        }
    }

    judgeDici(): void {
    	const diciArray: cc.Node[] = this.diciArray;
	    // 如果最后一个地刺已经出现在屏幕中
    	if (diciArray[diciArray.length - 1].y > -this.node.height / 2 - 50) {
			// 如果这时候最前面的地刺已经在屏幕外了，那么将它复用
            if (diciArray[0].y > this.node.height / 2 + 50) {
                const random: number = Math.random();
                const newDici: cc.Node = diciArray.shift();
                newDici.y = -this.node.height / 2 - 150 - 50 * random;
                this.diciDrection(newDici, random);
                diciArray.push(newDici);
            } else {
                // 否则新建一个地刺
                this.createDici(true);
            }
    	}
    }
}
