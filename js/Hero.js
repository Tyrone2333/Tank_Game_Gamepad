/**
 * Created by Administrator on 17-9-11.
 */

class Hero extends Sprite {
    constructor(x, y, imgUrl) {
        super(x, y, imgUrl)
        this.controlButtons.fire = "h" // 添加开火的按钮扩展
    }


}