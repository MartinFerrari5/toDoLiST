"use strict"
const express=require('express')
const app=express()
const date=require(__dirname + '/date.js')
const lodash=require("lodash")
const dataBase=require(__dirname + '/dataBase.js')
const mongoose = require("mongoose");
const { Schema } = mongoose;
const port=process.env.PORT || 3000
// PARA PODER LEER ARCHIVOS (CSS)

// EJS(templates)
app.set('view engine', 'ejs');

// PARA LEER METODO POST
app.use(express.urlencoded({
    extended: true
}))
// MONGOOSE
dataBase.activate()
// mongoose.connect(uri, {useNewUrlParser : true});
const itemsSchema = new Schema({
    name:  String
  });
  const List= mongoose.model('list', itemsSchema)
const item1= new List({
    name: "Welcome to your To Do List"
})
const item2=new List({
    name: "Press + no add an item"
})
const item3= new List({
    name: "<-- Touch it to delete an item"
})
const defaultItems=[item1, item2, item3]

const newList=new Schema({
    name: String,
    items: [itemsSchema]
})
  
  const Items= mongoose.model('item', newList)
  

app.get('/', (req, res)=>{
    
    List.find({}).then(function(foundItems){
        
        if(foundItems.length==0){
            List.insertMany(defaultItems)
            res.redirect('/')
        } else{
            res.render('list', {fullDay: date.getDate(),
                items: foundItems,
            url: "list"});
        }
      })
    
    // res.sendFile(__dirname + '/index.html')
    // dataBase.close()
})

app.post('/', (req, res)=>{
    dataBase.activate()
    // let tasks=[]
    let newItem=req.body.newItem
    let url=req.body.list
    if(newItem.length<2) {
        res.redirect('/')
        return
    }
    if(url!=='list'){
        Items.updateOne({name: `${url}`},
        {$push:{items:{
            name: newItem
        }}}).then(foundItems=>{
            // foundItems.items.push(newItem)
            // foundItems.save()
           
        })
        res.redirect(`${url}`)
    }else{
      let item= new List({
        name: newItem
      })
      item.save()
        
        res.redirect('/')
    }
})
// TEMPLATE DE WORK
app.get('/:topic', (req, res)=>{
    let urlTopic= req.params.topic.toLowerCase()
    let urlFirstLetter= lodash.capitalize(urlTopic)
    Items.find({name: urlTopic}).then(foundItems=>{
        
        if(foundItems.length==0) {
            const itemCreated= new Items({
                name: urlTopic,
                items: defaultItems
            })
            itemCreated.save()
            
            res.redirect(urlTopic)
        }else {
            res.render('list', {fullDay: `${urlFirstLetter}`,
            items: foundItems[0].items,
            url: `${urlTopic}`
            });
        }
    })
    
    // res.sendFile(__dirname + '/index.html')
})

// delete
app.post('/delete/:topic', (req,res)=>{
    const url=req.params.topic.toLowerCase()
    const task=req.body.check
    console.log(task)
    if(url!=='list'){
        Items.findOneAndUpdate({name: `${url}`},{
            $pull:{items:{name:task}}
        }).then(err=>{
            setTimeout(() => {
                res.redirect(`../${url}`)
             }, 500);
        })
        
    }else{
        List.deleteOne({name: `${task}`}).then(()=>{
        
            setTimeout(() => {
               res.redirect('/')
            }, 500);
       })
    }
    
   
})



app.use(express.static(__dirname))
app.listen(port, ()=>{
    console.log(`Listening to port ${port}`)
})

