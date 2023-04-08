"use strict"

const mongoose = require("mongoose");

module.exports.activate=async ()=>{
    const uri='mongodb://127.0.0.1:27017/listDB'
    await mongoose.connect(uri);
    
}

// const listSchema= new mongoose.Schema({
//     name: String
// })
// const List= mongoose.model('list', listSchema)

module.exports.data=async(dato)=>{
    const item= new List({
        name: dato
    })
    await item.save()
    
}


module.exports.close=()=>{
    mongoose.connection.close()
}
