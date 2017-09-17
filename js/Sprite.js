/**
 * Created by Enzo on 2017/8/24.
 */

 class Sprite{
    constructor(x,y,imgUrl){
        this.direction = 0  //  控制Sprite方向，上0 下1 左2 右3
        this.x = x  // 起始位置
        this.y = y
        this.speed = 10
        this.img = new Image()
        this.img.src = imgUrl  //  Sprite的贴图
        this.life = 1   //  血量
        this.isUp = false
        this.isDown = false
        this.isLeft = false
        this.isRight = false
        this.moveTimer = 0
        this.gp = null  // 游戏手柄，
        this.controlButtons = {
            left : "a",
            right : "e",
            up : ",",
            down : "o",
        }
        this.bullet = null // 经典坦克大战应该只有一个子弹，以后增加吃道具可连发


    }
    moveUp(){
        this.y -= this.speed
        this.direction = 0
    }
    moveDown(){
        this.y += this.speed
        this.direction = 1
    }
    moveLeft(){
        this.x -= this.speed
        this.direction = 2
    }
    moveRight(){
        this.x += this.speed
        this.direction = 3
    }

    // 监听Sprite的移动事件
    listenSpriteMove(){
        let _this = this
        window.addEventListener("keydown",function (ev) {
            if (this.life != 0){
                switch (ev.key) {
                    case this.controlButtons.up:
                        this.isUp = true
                        break
                    case this.controlButtons.down:
                        this.isDown = true
                        break
                    case this.controlButtons.left:
                        this.isLeft = true
                        break
                    case this.controlButtons.right:
                        this.isRight = true
                        break
                }
            }
        }.bind(this),false)
        window.addEventListener("keyup",function (ev) {
            switch (ev.key) {
                case this.controlButtons.up:
                    this.isUp = false
                    break
                case this.controlButtons.down:
                    this.isDown = false
                    break
                case this.controlButtons.left:
                    this.isLeft = false
                    break
                case this.controlButtons.right:
                    this.isRight = false
                    break
            }
        }.bind(this),false)
        // 检测手柄连接
        window.addEventListener("gamepadconnected", function (e) {
            this.gp = navigator.getGamepads()[e.gamepad.index];

            // this.gp = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : [])
            /**
             * this.gp           即是一个 Gamepad 对象
             * this.gp.mapping   返回空字符串表示没有映射是用这个手柄
             *              返回 standard 游戏手柄的控制已被映射到标准键盘布局。目前唯一已知的映射是“standard”
             * axes         摇杆，[-1.0 .. 1.0]
             */
//                log(this.gp)
            console.log("Gamepad 已连接 at index %d: %s. %d buttons, %d axes, %s 映射, %s  timestamp",
                this.gp.index, this.gp.id,
                this.gp.buttons.length, this.gp.axes.length,this.gp.mapping,this.gp.timestamp);

        }.bind(this),false);
        window.addEventListener("gamepaddisconnected", function(e) {
            console.error("Gamepad 已断开连接 from index %d: %s",
                e.gamepad.index, e.gamepad.id);
        }.bind(this),false);

        this.moveTimer = setInterval(function () {
            if (this.x <= 0){ //  不能出墙
                this.x = 0
            }else if (this.x >= 1100){
                this.x = 1100
            }
            if (this.y >= 400){
                this.y = 400
            }else if (this.y <= 0){
                this.y = 0
            }

            if (this.isUp){
                this.moveUp()
            }else if (this.isDown){
                this.moveDown()
            }else if (this.isLeft){
                this.moveLeft()
            }else if (this.isRight){
                this.moveRight()
            }
        }.bind(this),32)
    }

    isButtonPressed(b) {
        if (typeof(b) == "object") {
            return b.pressed;
        }
        return b == 1.0;
    }

    // 如果有手柄连接则开启手柄控制，需放在游戏的loop中
    getControlCommend() {

        if (this.gp){
//            左边摇杆
            // this.gp.axes[0] 1 => 右方向， -1 => 左方向
            // this.gp.axes[1] 1 => 下方向

//            右边摇杆
            // this.gp.axes[2] 1 => 右方向
            // this.gp.axes[3] 1 => 下方向

            //  this.gp.axes[0] 是形如 0.07541123691518906 极长的数字 .toFixed(2) 保留到两位
            if (this.gp.axes[0].toFixed(2) >= 0.3){
                this.moveRight()

            }else if (this.gp.axes[0].toFixed(2) <= -0.3){
                this.moveLeft()

            }else if (this.gp.axes[1].toFixed(2) >= 0.3){
                this.moveDown()

            }else if (this.gp.axes[1].toFixed(2) <= -0.3){
                this.moveUp()
            }

            if (this.isButtonPressed(this.gp.buttons[0])){
                this.fire()
            }
        }
    }

    showGameInfo(){
        let gameInfo = document.getElementById("gameInfo")
        let bulletState = document.getElementById("bulletState")
        let tankState = document.getElementById("tankState")
        let scoreInfo = document.getElementById("score")
        let controlInfo = document.getElementById("controlInfo")

        tankState.innerHTML = "x: " + this.x + " y: " + this.y
        if (this.bullet != null){
            bulletState.innerHTML = "this.bullets[0]：" + "x: " + this.bullet.x + "y: " + this.bullet.y + "<br>"
        }

        scoreInfo.innerHTML = this.score

        if (!!this.gp){
            controlInfo.innerHTML = "&nbsp;&nbsp;手柄已连接在："+this.gp.index+"端口<br>&nbsp;&nbsp;手柄是：" + this.gp.id
        }
    }
}
