/**
 * Created by Enzo on 2017/8/8.
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
    }

    listenTankMove(){
        // 监听tank的移动和发射事件
        // let _this = this
        window.addEventListener("keydown",function (ev) {
            if (this.life != 0){
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
                    switch (ev.key) {
                        case ",":
                            this.moveUp()
                            break
                        case "o":
                            this.moveDown()
                            break
                        case "a":
                            this.moveLeft()
                            break
                        case "e":
                            this.moveRight()
                            break
                        case "h":
                            this.fire()
                            break
                    }

            }

        }.bind(this),false)
    }

}
class EnemyTank extends Tank{
    constructor(x,y,imgUrl,num){
        super(x,y,imgUrl)
        this.num = num  //  敌军坦克出现的数量
        this.direction = ~~(Math.random()*4)  //  控制tank方向，上0 下1 左2 右3
        this.changeDirectionTimer = 0   //  自动换方向的定时器
        this.speed = 8
    }
    autoFire(){
        setInterval(function () {
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

        this.hero = new Hero(550,400,"img/tankBody.png")
        this.enemys = []
        for (let i = 0;i < 4; i++ ){
            this.enemys[i] = new EnemyTank(100*i,0,"img/EnemyTank.png",4)
            this.enemys[i].autoChangeDirection()
            this.enemys[i].autoFire()

        }

        this.timer = null
    }
    _main(){

        this.hero.listenTankMove()

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
        this.c.clearRect(0,0,this.canvas1.clientWidth,this.canvas1.clientHeight)


        // 画敌方tank
        for (let i = 0;i < this.enemys.length; i++ ){
            if (this.enemys[i].life != 0){

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
            }else {

            }

        }
        // 画自己tank
        if (this.hero.life != 0){
            this.drawTank(this.hero)
        }


        // 画heroTank子弹
        for (let i = 0; i < this.hero.bullets.length; i++){
            this.hero.bullets[i].run()

            if (this.hero.bullets[i].isLive){
                for (let j = 0; j < this.enemys.length; j++){
                    if (this.isCollision(this.hero.bullets[i],this.enemys[j])){ // 碰撞检测, heroBullet和enemy碰撞
                        this.enemys[j].life = 0
                        this.hero.bullets[i].isLive = false
                        this.drawBoom(this.enemys[j])
                        this.enemys.splice(j,1)
                    }
                }
                this.drawBullet(this.hero.bullets[i])
            }else {
                this.hero.bullets.splice(i,1)   //  在子弹消亡时及时删除该元素以免造成子弹数组过长影响性能
            }
        }

        this.c.strokeStyle = "gold"
        this.c.strokeRect(0,0,1200,500)

        this.showGameInfo()
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

        if (l1 > r2 || l2 > r1 || t1 > b2 || t2 > b1){
            return false
        }else {
            return true
        }
    }
    showGameInfo(){
        let gameInfo = document.getElementById("gameInfo")
        let bulletState = document.getElementById("bulletState")
        let tankState = document.getElementById("tankState")

        tankState.innerHTML = "x: " + this.hero.x + "y: " + this.hero.y
        // log(this.hero.bullets[0])
        if (this.hero.bullets.length != 0){
            bulletState.innerHTML = "this.hero.bullets[0]：" + "x: " + this.hero.bullets[0].x + "y: " + this.hero.bullets[0].y + "<br>"
        }

    }
    rotateImg(ctx,img,x,y,width,height,angle) {    //  图像旋转：基础变换法
        ctx.save()
        ctx.translate(x + width / 2,  y + height / 2)   //  x,y 是图片draw的位置
        ctx.rotate(angle * Math.PI / 180)
        ctx.drawImage(img, -width / 2,  -height / 2, width, height)
        ctx.restore()
    }
    drawBullet(bullet){

        if (bullet.direction == 0){
            this.c.drawImage(bullet.bulletBody,bullet.x + 42,bullet.y - 20)
            this.c.strokeRect(bullet.x + 42,bullet.y - 20,16,32)
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

}


window.onload = function () {

    // for (let i = 0;i < 6; i++){
    //     let a = ~~(Math.random()*4)
    //     log(a)
    // }


    let game = new Game()
    game._main()



}