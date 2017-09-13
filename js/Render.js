/**
 * Created by Enzo on 2017/8/24.
 */
class Render{
    constructor(canvasEle,fps){
        this.canvas = document.getElementById(canvasEle)
        this.ctx = this.canvas.getContext("2d")
        this.fps = fps
        this.isPause = false
        this.timer = 0
        this.loopFn = null    // 需要循环执行的代码块
    }
    drawPicture (img,x,y,width,height){
        // log(this)
        let i = new Image()
        i.src = img

        if (arguments.length == 5){
            this.ctx.drawImage(i,x,y,width,height)
        }else if(arguments.length == 3){
            this.ctx.drawImage(i,x,y)
        }
    }
    drawSprite(sprite){
        if ( sprite.direction == 0){
            this.ctx.drawImage(sprite.img,sprite.x,sprite.y)
        }else if (sprite.direction == 1){
            this.rotateImg(sprite.img,sprite.x,sprite.y,100,100,180)
        }else if (sprite.direction == 2){
            this.rotateImg(sprite.img,sprite.x,sprite.y,100,100,270)
        }else if (sprite.direction == 3){
            this.rotateImg(sprite.img,sprite.x,sprite.y,100,100,90)
        }
    }
    rotateImg(img,x,y,width,height,angle) {    //  图像旋转：基础变换法
        this.ctx.save()
        this.ctx.translate(x + width / 2,  y + height / 2)   //  x,y 是图片draw的位置
        this.ctx.rotate(angle * Math.PI / 180)
        this.ctx.drawImage(img, -width / 2,  -height / 2, width, height)
        this.ctx.restore()
    }

    clear(){
        this.ctx.clearRect(0,0,this.canvas.clientWidth,this.canvas.clientHeight)
    }
    pause(){
        this.timer = null
        this.isPause = true
    }
    reStart(){
        this.isPause = false
        this.begin()
    }

    begin(){

            this.timer = setInterval( () => {
                if(this.isPause){
                    return
                }else {
                    this.clear()
                    this.loopFn()
                }

            },1000/this.fps)

        // this.timer = setInterval( () => {
        //
        //     log(this)
        // },1000)
    }
}