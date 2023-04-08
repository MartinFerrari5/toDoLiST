"use strict"

module.exports.getDate=function (){
    // DIA
let options = { weekday: 'long',
month: 'long',
 day: 'numeric' };
let fecha  = new Date();

let title=fecha.toLocaleDateString("en-US", options)
    return title


}