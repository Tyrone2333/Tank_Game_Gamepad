/**
 * Created by Enzo on 2017/8/8.
 *
 * used by ./Tank Game.html
 */
// 画十字
function drawCrossLine(canvasEle,length) {
    let ctx = canvasEle.getContext("2d")
    let centX = canvasEle.width/2
    let centY = canvasEle.height/2
    log(centX - length + " " +centY)
    ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
    ctx.beginPath()
    ctx.strokeStyle = "#4d5bf4"
    ctx.lineWidth = 2
    ctx.moveTo(centX - length,centY)
    ctx.lineTo(centX + length,centY)
    ctx.closePath()
    ctx.stroke()
    ctx.beginPath()
    moveTo(centX,centY - length)
    ctx.lineTo(centX,centY - length)
    ctx.lineTo(centX,centY + length)
    ctx.closePath()
    ctx.stroke()
}
// 把canvas变成画板
function writeFree(canvasEle) {
    let ctx = canvasEle.getContext('2d')
    canvasEle.onmousedown = function (ev) {
        ctx.beginPath()
        var ev = ev || window.event
        ctx.moveTo(ev.clientX,ev.clientY)
//                console.log(this)
        document.onmousemove = function (ev) {
            var ev = ev || window.event
            ctx.lineTo(ev.clientX,ev.clientY)
            ctx.stroke()
        }
        document.onmouseup = function () {
            document.onmousemove = null
            document.onmouseup = null
        }
        return false
    }
}
//  图像旋转：基础变换法
function rotateImg(img,x,y,width,height,angle) {    //  图像旋转：基础变换法
    ctx.save()
    ctx.translate(x + width / 2,  y + height / 2)   //  x,y 是图片draw的位置
    ctx.rotate(angle * Math.PI / 180)
    ctx.drawImage(img, -width / 2,  -height / 2, width, height)
    ctx.restore()
}
//图像镜像对称（翻转+旋转）
function mirrorImg(img,x,y,width,height,angle) {  //图像镜像对称（翻转+旋转）
    ctx.save()
    ctx.scale(-1, 1)
    ctx.translate(-width/2-x, y+height/2)
    ctx.rotate(-angle * Math.PI / 180)
    ctx.drawImage(img, -width / 2,  -height / 2, width, height)
    ctx.restore()
}

var log = function (message) {
    console.log(message)
}

class Tank{
    constructor(x,y,imgUrl){
        this.direction = 0  //  控制tank方向，上0 下1 左2 右3
        this.x = x
        this.y = y
        this.speed = 10
        this.tankBody = new Image()
        this.tankBody.src = imgUrl  //  tank的贴图
        this.life = 1   //  tank的血量
        this.bullets = []   // 经典坦克大战应该只有一个子弹，以后增加吃道具可连发
        this.score = 0
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
    fire(){
        if (this.bullets.length == 0){  // 一次只能发射一颗子弹
            let aBullet = new Bullet(this.x,this.y,this.direction,"img/fire.png")
            this.bullets.push(aBullet)
        }
    }

}
class Hero extends Tank{
    constructor (x,y,imgUrl){
        super(x,y,imgUrl)
        this.isUp = false
        this.isDown = false
        this.isLeft = false
        this.isRight = false
        this.moveTimer = 0
        this.gp = null
    }

    move(){

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
    listenTankMove(){
        // 监听tank的移动和发射事件
        // let _this = this
        window.addEventListener("keydown",function (ev) {
            if (this.life != 0){
                    switch (ev.key) {
                        case ",":
                            this.isUp = true
                            break
                        case "o":
                            this.isDown = true
                            break
                        case "a":
                            this.isLeft = true
                            break
                        case "e":
                            this.isRight = true
                            break
                        case "h":
                            this.fire()
                            break
                    }

            }

        }.bind(this),false)
        window.addEventListener("keyup",function (ev) {
            switch (ev.key) {
                case ",":
                    this.isUp = false
                    break
                case "o":
                    this.isDown = false
                    break
                case "a":
                    this.isLeft = false
                    break
                case "e":
                    this.isRight = false
                    break
            }
        }.bind(this),false)
        // 检测手柄连接
        window.addEventListener("gamepadconnected", function (e) {
            this.gp = navigator.getGamepads()[e.gamepad.index];
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
    }
    isButtonPressed(b) {
        if (typeof(b) == "object") {
            return b.pressed;
        }
        return b == 1.0;
    }
    getControlCommend() {
    if (this.gp){
        //                    log(this.gp.axes[0].toFixed(2))
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


}
class EnemyTank extends Tank{
    constructor(x,y,imgUrl,num){
        super(x,y,imgUrl)
        this.num = num  //  敌军坦克出现的数量
        this.direction = ~~(Math.random()*4)  //  控制tank方向，上0 下1 左2 右3
        this.changeDirectionTimer = 0   //  自动换方向的定时器
        this.fireTimer = 0
        this.speed = 8
    }
    _die(){
        /**
         * enemy死亡但仍存在数组中，防止enemy死亡子弹消失，但这样将导致enemy数组越来越长影响性能
         */
        window.clearInterval(this.changeDirectionTimer)
        window.clearInterval(this.fireTimer)
        this.life = 0
        // this.x = -100
        // this.y = -100
    }
    autoFire(){
        this.fireTimer = setInterval(function () {
            if (this.bullets.length == 0){  // 一次只能发射一颗子弹
                let aBullet = new Bullet(this.x,this.y,this.direction,"img/fire.png")
                this.bullets.push(aBullet)
            }
        }.bind(this),1000)
    }
    autoMove(){
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

        switch (this.direction){
            case 0:
                this.y -= this.speed
                break
            case 1:
                this.y += this.speed
                break
            case 2:
                this.x -= this.speed

                break
            case 3:
                this.x += this.speed
                break
        }


    }
    autoChangeDirection(){
        this.changeDirectionTimer = setInterval(function () {
            this.direction = ~~(Math.random()*4)    //  创建0 -> 3 的随机数
        }.bind(this),1000)
    }
}
class Bullet{
    constructor(x,y,direction,imgUrl){
        this.direction = direction  //  控制子弹方向，上0 下1 左2 右3
        this.x = x
        this.y = y
        this.speed = 12
        this.bulletBody = new Image()
        this.bulletBody.src = imgUrl  //  子弹的贴图
        this.isLive = true // 如果子弹碰壁或者碰到敌人则子弹消失
    }
    run(){
        if (this.x <= -1 || this.x >= 1200 || this.y <= -1 || this.y >= 500){ //  子弹碰壁,修复tank在最左和最上无法发射子弹的bug
            this.isLive = false
        }else {
            switch (this.direction){
                case 0:
                    this.y -= this.speed
                    break
                case 1:
                    this.y += this.speed
                    break
                case 2:
                    this.x -= this.speed

                    break
                case 3:
                    this.x += this.speed
                    break
            }
        }

    }
}
class Game{
    constructor(){
        this.canvas1 = document.getElementById("c1")
        this.c = this.canvas1.getContext('2d')

        this.hero = new Hero(550,380,"img/tankBody.png")
        this.enemys = []
        for (let i = 0;i < 4; i++ ){
            this.enemys[i] = new EnemyTank(300*i,0,"img/EnemyTank.png",4)
            this.enemys[i].autoChangeDirection()
            this.enemys[i].autoFire()

        }

        this.timer = null
    }
    _main(){

        this.hero.listenTankMove()
        this.hero.move()

        //  刷新画布，比较消耗性能
        this.timer = setInterval(function () {
            this.refreshCanvas()
        }.bind(this),32)    // 把定时器的this(window) 绑定成Game

        /**
         * 暂停有大问题,用定时器刷新画布使控制非常麻烦
         * @type {number}
         */
        let pauseBtn = document.getElementById("pause")
        let startBtn = document.getElementById("start")
        pauseBtn.onclick = function () {
            log("已清除定时器("+this.timer+")")
            window.clearInterval(this.timer)
        }.bind(this)
        startBtn.onclick = function () {
            window.clearInterval(this.timer)     //  先清除上一个定时器，这样就不会造成多次点击开始按钮生成多个定时器

            this.timer = setInterval(function () {
                this.refreshCanvas()
                log("当前定时器编号" + this.timer)
            }.bind(this),32)    // 把定时器的this绑定成Game
        }.bind(this)

    }

    refreshCanvas (){
        //  数据刷新和画布的刷新分离
        this.hero.getControlCommend()
        this.c.clearRect(0,0,this.canvas1.clientWidth,this.canvas1.clientHeight)

        // 画敌方tank

        this.drawEnemys()
        // 画自己tank
        this.drawHeroTank()

        this.showGameInfo()
    }

    drawEnemys(){
        // 画enemyTank、画enemyTank子弹、Hero和enemy碰撞检测
        for (let i = 0;i < this.enemys.length; i++ ){

            // 画enemyTank子弹
            for (let j = 0; j < this.enemys[i].bullets.length; j++) {
                this.enemys[i].bullets[j].run()

                if (this.enemys[i].bullets[j].isLive){
                    if(this.isCollision(this.enemys[i].bullets[j],this.hero)){
                        this.drawBoom(this.hero)
                        this.enemys[i].bullets.splice(j,1)
                        this.hero.life = 0
                        window.clearInterval(this.timer)
                    }
                    this.drawBullet(this.enemys[i].bullets[j])
                }else {
                    this.enemys[i].bullets.splice(j,1)   //  在子弹消亡时及时删除该元素以免造成子弹数组过长影响性能
                }
            }
            // Hero和enemy碰撞检测
            if (this.enemys[i].life != 0){
                if(this.isCollision(this.hero,this.enemys[i])){

                    this.drawBoom(this.hero)

                    this.enemys.splice(i,1)
                    this.hero.life = 0
                    window.clearInterval(this.timer)
                    // log(this.enemys)
                    // window.clearInterval(timer)
                }

                this.enemys[i].autoMove()

                this.drawTank(this.enemys[i])
            }

        }
    }
    drawHeroTank(){
        // 画自己tank
        if (this.hero.life != 0){
            this.drawTank(this.hero)
        }

        // 画heroTank子弹
        for (let i = 0; i < this.hero.bullets.length; i++){
            this.hero.bullets[i].run()

            if (this.hero.bullets[i].isLive){
                for (let j = 0; j < this.enemys.length; j++){
                    if(this.enemys[j].life != 0){
                        if (this.isCollision(this.hero.bullets[i],this.enemys[j])){ // 碰撞检测, heroBullet和enemy碰撞
                            this.enemys[j].life = 0
                            this.hero.bullets[i].isLive = false
                            this.drawBoom(this.enemys[j])
                            this.enemys[j]._die()
                            this.hero.score ++
                            this.createNewEnemy()
                            // this.enemys.splice(j,1)  // 会导致敌人死亡时子弹也消失
                        }
                    }
                }
                this.drawBullet(this.hero.bullets[i])
            }else {
                this.hero.bullets.splice(i,1)   //  在子弹消亡时及时删除该元素以免造成子弹数组过长影响性能
            }
        }
    }
    createNewEnemy(){
        // 一个enemy死亡后间隔一段时间再生成一个新enemy
        setTimeout(function () {
            let newEnemy = new EnemyTank(1000*(Math.random()),0,"img/EnemyTank.png",4)
            newEnemy.autoChangeDirection()
            newEnemy.autoFire()
            this.enemys.push(newEnemy)
        }.bind(this),1000)
    }

    drawBullet(bullet){
        if (bullet.direction == 0){
            this.c.drawImage(bullet.bulletBody,bullet.x + 42,bullet.y - 20)
        }else if (bullet.direction == 1){
            this.rotateImg(this.c,bullet.bulletBody,bullet.x + 41,bullet.y + 100,16,32,180)
        }else if (bullet.direction == 2){
            this.rotateImg(this.c,bullet.bulletBody,bullet.x - 20,bullet.y + 35,16,32,270)
        }else if (bullet.direction == 3){
            this.rotateImg(this.c,bullet.bulletBody,bullet.x + 108,bullet.y + 35,16,32,90)
        }
    }

    drawTank(aTank){
        if ( aTank.direction == 0){
            this.c.drawImage(aTank.tankBody,aTank.x,aTank.y)
        }else if (aTank.direction == 1){
            this.rotateImg(this.c,aTank.tankBody,aTank.x,aTank.y,100,100,180)
        }else if (aTank.direction == 2){
            this.rotateImg(this.c,aTank.tankBody,aTank.x,aTank.y,100,100,270)
        }else if (aTank.direction == 3){
            this.rotateImg(this.c,aTank.tankBody,aTank.x,aTank.y,100,100,90)
        }
    }
    drawBoom(aTank){
        /**
         * context.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
         *
         *   sx	可选。开始剪切的 x 坐标位置。
         *   sy	可选。开始剪切的 y 坐标位置。
         *    swidth	可选。被剪切图像的宽度。
         *    sheight	可选。被剪切图像的高度。
         */

        // 因为只有一个img所以连续击中爆炸会导致gif没播放完就飞到了下一个爆炸的地方，后续优化
        let boomImg = document.getElementById("boomImg")

        boomImg.src = "img/boom.gif"
        boomImg.onload = function () {
            boomImg.style.display = "block"
            boomImg.style.top = aTank.y + "px"
            boomImg.style.left = aTank.x + "px"

            setTimeout(function () {
                boomImg.style.display = "none"
                // boomImg.src = "img/_boom.png"
            },1000)
        }

    }

    isCollision(obj1,obj2){
        let l1,r1,t1,b1
        let l2,r2,t2,b2

        if (obj1 instanceof Hero && obj2 instanceof EnemyTank){
            // log("obj1 instanceof Hero && obj2 instanceof EnemyTank")
            //  碰撞检测, hero和enemy碰撞
            l1 = obj1.x
            r1 = obj1.x + obj1.tankBody.width
            t1 = obj1.y
            b1 = obj1.y + obj1.tankBody.height

            l2 = obj2.x
            r2 = obj2.x + obj2.tankBody.width
            t2 = obj2.y
            b2 = obj2.y + obj2.tankBody.height
        }else if (obj1 instanceof Bullet && obj2 instanceof EnemyTank){
            //  碰撞检测, heroBullet和enemy碰撞
            l1 = obj1.x
            r1 = obj1.x + obj1.bulletBody.width
            t1 = obj1.y
            b1 = obj1.y + obj1.bulletBody.height

            l2 = obj2.x
            r2 = obj2.x + obj2.tankBody.width
            t2 = obj2.y
            b2 = obj2.y + obj2.tankBody.height
        }else if (obj1 instanceof Bullet && obj2 instanceof Hero){
            //  碰撞检测, heroBullet和enemy碰撞
            l1 = obj1.x
            r1 = obj1.x + obj1.bulletBody.width
            t1 = obj1.y
            b1 = obj1.y + obj1.bulletBody.height

            l2 = obj2.x
            r2 = obj2.x + obj2.tankBody.width
            t2 = obj2.y
            b2 = obj2.y + obj2.tankBody.height
        }

        let result = l1 > r2 || l2 > r1 || t1 > b2 || t2 > b1
        return !result

        // if (l1 > r2 || l2 > r1 || t1 > b2 || t2 > b1){
        //     return false
        // }else {
        //     return true
        // }
    }
    showGameInfo(){
        let gameInfo = document.getElementById("gameInfo")
        let bulletState = document.getElementById("bulletState")
        let tankState = document.getElementById("tankState")
        let scoreInfo = document.getElementById("score")
        let controlInfo = document.getElementById("controlInfo")

        tankState.innerHTML = "x: " + this.hero.x + "y: " + this.hero.y
        // log(this.hero.bullets[0])
        if (this.hero.bullets.length != 0){
            bulletState.innerHTML = "this.hero.bullets[0]：" + "x: " + this.hero.bullets[0].x + "y: " + this.hero.bullets[0].y + "<br>"
        }

        scoreInfo.innerHTML = this.hero.score

        if (!!this.hero.gp){
            controlInfo.innerHTML = "&nbsp;&nbsp;手柄已连接在："+this.hero.gp.index+"端口<br>&nbsp;&nbsp;手柄是：" + this.hero.gp.id
        }


    }
    rotateImg(ctx,img,x,y,width,height,angle) {    //  图像旋转：基础变换法
        ctx.save()
        ctx.translate(x + width / 2,  y + height / 2)   //  x,y 是图片draw的位置
        ctx.rotate(angle * Math.PI / 180)
        ctx.drawImage(img, -width / 2,  -height / 2, width, height)
        ctx.restore()
    }

}


window.onload = function () {

    let game = new Game()
    game._main()

}