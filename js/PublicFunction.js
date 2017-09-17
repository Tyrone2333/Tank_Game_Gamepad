/**
 * Created by Enzo on 2017/8/24.
 */
let log = function (meg) {
    if (typeof meg === "string" || typeof meg === "number") {
        console.warn(meg)
    }else if(typeof meg === "object") {
        // let o = meg
        // for(let name in o){
        //     console.log(name + ':' + o[name])
        // }
        console.log(meg)

    }else {
            console.log(meg)
    }
}