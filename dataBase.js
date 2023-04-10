"use strict"

const mongoose = require("mongoose");

module.exports.activate=async ()=>{
  try {
    const uri=process.env.MONGO_URI
    await mongoose.connect(uri);
  } catch (error) {
    process.exit(1)
  }
    
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
