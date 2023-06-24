 const express = require("express")
 const bodyparser = require("body-parser")
 const date = require(__dirname + "/functions.js")
 const mongoose = require("mongoose")

 const app = express()


 main().catch(err => console.log(err));

 async function main() {
   await mongoose.connect('mongodb://127.0.0.1:27017/todolist')
}


app.set("view engine", "ejs")
app.use(bodyparser.urlencoded({extended:true}))
app.use(express.static("public"))



const itemsSchema = new mongoose.Schema({      //creating a schema for the items
   itemName:String,
   
})
const Item = mongoose.model("Item", itemsSchema)       //creating the model for the item list


const item1 = new Item({
   itemName:"Wake Up "
})
const item2 = new Item({
   itemName:"Have  routine"
})
const item3 = new Item({
   itemName:"Dress up"
})

const DefaultItems = [item1,item2,item3]      //default items to print when no tasks in todo list


const listSchema = new mongoose.Schema ({      //schema for the list 
   name:String,
   items:[itemsSchema]
})

const List = mongoose.model("List",listSchema)      // creating the model for list
 


 app.get("/",function(req,res){                 // home page 
   var day = date.getDate()             
   var time = date.getTime() 

   Item.find({}).exec().then((founditems =>{        
      if(founditems.length === 0){ 
         Item.insertMany(DefaultItems)
         console.log("sucessfully added default items to list")
         res.redirect("/")
  }else{ res.render("list",{ListTitle:day,newlistItems:founditems, Time:time }) }
  }))  
})




app.post("/",function(req,res){                      // post route when new element or task is added 
   const addedTask = req.body.new_item
   const addedItem = new Item({
      itemName:addedTask
   })
   addedItem.save()
   console.log(addedItem.id)
   res.redirect("/")
})


const DeletedSchema = new mongoose.Schema ({       //schema for the deleted task to be stored
   deletedTask:String
})
const Deleted = mongoose.model("Deleted",DeletedSchema)   // creating the model for the deleted items


app.post("/delet",function(req,res){                // delete route when posted (on checking the checkbox) 
   const checkeditemId = req.body.checkbox                  //for the tasks in the home pade (todolist)

   Item.findOne({_id:checkeditemId}).then((task)=>{ 
   const taskName = task.itemName
   const newtask = new Deleted({
      deletedTask:taskName
      })  
      newtask.save()
      console.log(taskName)
   })
   Item.findByIdAndRemove(checkeditemId).then(() =>  
      res.redirect("/")).catch((err) =>{console.log(err)})           //redirecting to the home page
})

defaultresponce = ["no completed task"]

app.get("/views/completed.ejs",function(req,res){        //route for the completed items when deleted from todolist
   // console.log("hey there")
   var day = date.getDate() 
  Deleted.find({}).exec().then(itemsDel =>{
   if (itemsDel.length === 0){
      res.render("completed",{dellItems:defaultresponce})
   }else{
      res.render("completed",{dellItems:itemsDel})
   }
  })
 })


app.post("/erase",function(req,res){                       //   post route when task are deleted for the deleted list
   const checkedTask = req.body.clickBox                       // completely deleting for the database
   Deleted.findByIdAndRemove(checkedTask).then(()=> 
   res.redirect("/views/completed.ejs",)).catch((err) =>{console.log(err)})        //redirecting to the completed page 
})

   


app.listen(3000,function(){
    console.log("server is initiated");
    console.log("initiated in the server 3000");
    console.log( date.getTime() );
})