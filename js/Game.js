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
        let render_game = new Render("myCanvas-game",30)
        let render_map = new Render("myCanvas-map",30)
        let _this = this

        // 注册暂停和重启事件
        this.registerActions("r",function () {
            render_game.reStart()
        })
        this.registerActions("p",function () {
            render_game.pause()
        })

        // 需要循环执行的代码块
        render_game.loopFn = function () {
            render_game.drawSprite(hero)
            render_game.drawBullet(hero.bullet)
            // render_game.drawSprite(hero.bullet)
            hero.getControlCommend()
            hero.showGameInfo()

        }
        render_game.begin()
        // render_map.drawMap(6)

        this.listenAndDoEvent()
        hero.listenSpriteMove()
        hero.listenHeroFire()

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
                if (this.keyDowns[key]){
                    this.actions[key]()
                }
            }
        }.bind(this),32)
    }
}