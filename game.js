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
    }
}
class Hero extends Tank{
    constructor (x,y,imgUrl){
        super(x,y,imgUrl)
        this.bullets = new Array()

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

    listenTankMove(){
        // 监听tank的移动和发射事件
        // let _this = this
        window.addEventListener("keydown",function (ev) {
            switch (ev.key){
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
        }.bind(this),false)
    }
    fire(){
        let aBullet = new Bullet(this.x,this.y,this.direction,"img/fire.png")
        // bullet.run()
        this.bullets.push(aBullet)
    }
}
class EnemyTank extends Tank{
    constructor(x,y,imgUrl,num){
        super(x,y,imgUrl)
        this.num = num  //  敌军坦克出现的数量
        this.direction = 1  //  控制tank方向，上0 下1 左2 右3
    }
}
class Bullet{
    constructor(x,y,direction,imgUrl){
        this.direction = direction  //  控制子弹方向，上0 下1 左2 右3
        this.x = x
        this.y = y
        this.speed = 15
        this.bulletBody = new Image()
        this.bulletBody.src = imgUrl  //  子弹的贴图
        this.isLive = true // 如果子弹碰壁或者碰到敌人则子弹消失
    }
    run(){
        if (this.x <= 0 || this.x >= 1200 || this.y <= 0 || this.y >= 500){ //  子弹碰壁
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

        this.P = Math.PI

        this.hero = new Hero(100,100,"img/tankBody.png")
        this.enemys = new Array()
        for (let i = 0;i < 4; i++ ){
            this.enemys[i] = new EnemyTank(100*i,0,"img/EnemyTank.png",4)
        }
    }
    _main(){

        this.hero.listenTankMove()
        //  每秒都刷新画布，可能比较消耗性能
        let timer = setInterval(function () {
            this.refreshCanvas()
            log("当前定时器编号" + timer)
        }.bind(this),32)    // 把定时器的this绑定成Game

        let pauseBtn = document.getElementById("pause")
        let startBtn = document.getElementById("start")
        pauseBtn.onclick = function () {
            log("已清除定时器("+timer+")")
            window.clearInterval(timer)
        }
        startBtn.onclick = function () {
            window.clearInterval(timer)     //  先清除上一个定时器，这样就不会造成多次点击开始按钮生成多个定时器

            timer = setInterval(function () {
                this.refreshCanvas()
                log("当前定时器编号" + timer)
            }.bind(this),32)    // 把定时器的this绑定成Game
        }.bind(this)

    }

    refreshCanvas (){
        //  数据刷新和画布的刷新分离
        this.c.clearRect(0,0,this.canvas1.clientWidth,this.canvas1.clientHeight)


        for (let i = 0;i < 4; i++ ){
            this.drawTank(this.enemys[i])
        }

        this.drawTank(this.hero)

        for (let i = 0; i < this.hero.bullets.length; i++){
            this.drawBullet(this.hero.bullets[i])
        }

        this.showGameInfo()
    }

    showGameInfo(){
        let gameInfo = document.getElementById("gameInfo")
        let bulletState = document.getElementById("bulletState")
        let tankState = document.getElementById("tankState")

        tankState.innerHTML = "x: " + this.hero.x + "y: " + this.hero.y
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
            this.c.drawImage(bullet.bulletBody,bullet.x,bullet.y)
        }else if (bullet.direction == 1){
            this.rotateImg(this.c,bullet.bulletBody,bullet.x,bullet.y,16,32,180)
        }else if (bullet.direction == 2){
            this.rotateImg(this.c,bullet.bulletBody,bullet.x,bullet.y,16,32,270)
        }else if (bullet.direction == 3){
            this.rotateImg(this.c,bullet.bulletBody,bullet.x,bullet.y,16,32,90)
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

}


window.onload = function () {

    let game = new Game()
    game._main()

}