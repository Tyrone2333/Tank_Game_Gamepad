/**
 * Created by Enzo on 2017/8/24.
 */
class Render {
    constructor(canvasEle, fps) {
        this.canvas = document.getElementById(canvasEle)
        this.ctx = this.canvas.getContext("2d")
        this.fps = fps
        this.isPause = false
        this.timer = 0
        this.loopFn = null    // 需要循环执行的代码块
    }

    drawPicture(img, x, y, width, height) {
        // log(this)
        let i = new Image()
        i.src = img

        if (arguments.length === 5) {
            this.ctx.drawImage(i, x, y, width, height)
        } else if (arguments.length === 3) {
            this.ctx.drawImage(i, x, y)
        }
    }

    drawSprite(sprite) {
        if (sprite !== null && sprite.life !== 0) {
            if (sprite.direction === 0) {
                this.ctx.drawImage(sprite.img, sprite.x, sprite.y)
            } else if (sprite.direction === 1) {
                this.rotateImg(sprite.img, sprite.x, sprite.y, sprite.img.width, sprite.img.height, 180)
            } else if (sprite.direction === 2) {
                this.rotateImg(sprite.img, sprite.x, sprite.y, sprite.img.width, sprite.img.height, 270)
            } else if (sprite.direction === 3) {
                this.rotateImg(sprite.img, sprite.x, sprite.y, sprite.img.width, sprite.img.height, 90)
            }
        }

    }

    drawBullet(sprite) {
        if (sprite !== null && sprite.life !== 0) {
            if (sprite.direction === 0) {
                this.ctx.drawImage(sprite.img, sprite.x + 42, sprite.y - 20)
            } else if (sprite.direction === 1) {
                this.rotateImg(sprite.img, sprite.x + 41, sprite.y + 100, sprite.img.width, sprite.img.height, 180)
            } else if (sprite.direction === 2) {
                this.rotateImg(sprite.img, sprite.x - 20, sprite.y + 35, sprite.img.width, sprite.img.height, 270)
            } else if (sprite.direction === 3) {
                this.rotateImg(sprite.img, sprite.x + 108, sprite.y + 35, sprite.img.width, sprite.img.height, 90)
            }
        }


    }

    rotateImg(img, x, y, width, height, angle) {    //  图像旋转：基础变换法
        this.ctx.save()
        this.ctx.translate(x + width / 2, y + height / 2)   //  x,y 是图片draw的位置
        this.ctx.rotate(angle * Math.PI / 180)
        this.ctx.drawImage(img, -width / 2, -height / 2, width, height)
        this.ctx.restore()
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight)
    }

    pause() {
        this.timer = null
        this.isPause = true
    }

    reStart() {
        this.isPause = false
        this.begin()
    }

    begin() {

        this.timer = setInterval(() => {
            if (this.isPause) {
                return
            } else {
                this.clear()
                this.loopFn()
            }

        }, 1000 / this.fps)

        // this.timer = setInterval( () => {
        //
        //     log(this)
        // },1000)
    }

    drawMap(level) {
        let nowLevel = "map" + level
        let mapImg = new Image()
        mapImg.src = "img/tankAll.gif"

        this.ctx.fillStyle = "#000"
        this.ctx.fillRect(0, 0, 416, 416)

        for (let i = 0; i < 26; i++) {
            for (let j = 0; j < 26; j++) {

                switch (map12[i][j]) {
                    case 0:
//                            this.ctx.drawImage(mapImg,0,0,16,16,16*i,16*j,16,16)
                        break
                    case 1:
                        this.ctx.drawImage(mapImg, 0, 96, 16, 16, 16 * j, 16 * i, 16, 16)
                        break
                    case 2:
                        this.ctx.drawImage(mapImg, 16, 96, 16, 16, 16 * j, 16 * i, 16, 16)
                        break
                    case 3:
                        this.ctx.drawImage(mapImg, 32, 96, 16, 16, 16 * j, 16 * i, 16, 16)
                        break
                    case 4:
                        this.ctx.drawImage(mapImg, 48, 96, 16, 16, 16 * j, 16 * i, 16, 16)
                        break
                    case 5:
                        this.ctx.drawImage(mapImg, 64, 96, 16, 16, 16 * j, 16 * i, 16, 16)
                        break
                    case 9:
                        this.ctx.drawImage(mapImg, 256, 0, 32, 32, 16 * j, 16 * i, 32, 32)
                        break
                }
                if (map[i][j] === 0) {
//                        this.ctx.drawImage(mapImg,0,0,16,16,16*i,16*j,16,16)
                    log("???")
                }
            }
        }
    }
}