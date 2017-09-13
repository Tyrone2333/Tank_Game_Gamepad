/**
 * Created by Administrator on 17-9-11.
 */

class Bullet extends Sprite{
    constructor(x,y,imgUrl,direction){
        super(x,y,imgUrl)
        this.direction = direction  //  控制子弹方向，上0 下1 左2 右3,应该由父级单位确定

    }
    run(){
        if (this.x <= -1 || this.x >= 1200 || this.y <= -1 || this.y >= 500){ //  子弹碰壁,修复tank在最左和最上无法发射子弹的bug
            this.live = 0
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