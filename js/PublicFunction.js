/**
 * Created by Enzo on 2017/8/24.
 */
let log = function (meg) {
    if (typeof meg === "string" || typeof meg === "number") {
        console.warn(meg)
    } else {
        console.log(meg)
    }
}