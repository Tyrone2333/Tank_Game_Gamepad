/**
 * Created by Enzo on 2017/8/24.
 */
class Game {
    constructor(){
        this.keyDowns = {}  // 存储哪些按键被按下
        this.actions = {}   //  存储按键对应的行为
    }
    _main(){

        let hero = new Hero(550,160,"./img/tank.png")
        let render = new Render("myCanvas",30)
        let _this = this
        this.listenAndDoEvent()

        // 注册暂停和重启事件
        this.registerActions("r",function () {
            render.reStart()
        })
        this.registerActions("p",function () {
            render.pause()
        })

        // 需要循环执行的代码块
        render.loopFn = function () {
            render.drawSprite(hero)
            hero.getControlCommend()
            hero.showGameInfo()

        }
        render.begin()

        hero.listenSpriteMove()
        // hero.getControlCommend()
    }
    registerActions(key,callback){
        this.actions[key] = callback
    }

    listenAndDoEvent(){
        // 监听并存储哪些按键被按下，并执行对应的行为
        window.addEventListener("keydown", event => {
            this.keyDowns[event.key] = true
        })
        window.addEventListener("keyup", event => {
            this.keyDowns[event.key] = false
        })

        setInterval(function () {
            let keys = Object.keys(this.actions)   //  actions 含有的key
            for (let i = 0; i < keys.length; i ++){
                let key = keys[i]
                if (this.keyDowns[key] == true){
                    this.actions[key]()
                }
            }
        }.bind(this),32)
    }
}