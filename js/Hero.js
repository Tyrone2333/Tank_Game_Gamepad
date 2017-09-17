/**
 * Created by Administrator on 17-9-11.
 */

class Hero extends Sprite {
    constructor(x, y, imgUrl) {
        super(x, y, imgUrl)
        this.controlButtons.fire = "h" // 添加开火的按钮扩展
        this.fireTimer = 0
    }

    fire(){
        if (this.bullet == null || this.bullet.life == 0){
            this.bullet = new Bullet(this.x, this.y, "./img/fire.png",this.direction)

        }else {
            this.bullet.run()
        }
    }

    listenHeroFire(){
        let _this = this
        window.addEventListener("keydown",function (ev) {
            if (this.life != 0){
                switch (ev.key) {
                    case this.controlButtons.fire:
                        this.fire()
                        break
                }
            }
        }.bind(this),false)

        this.fireTimer = setInterval( () => {
            if (_this.bullet != null && _this.bullet.life != 0){
                _this.bullet.run()
            }
        },32)
    }

}