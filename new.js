const express = require('express');
const app = express();
app.use(express.json());
const main = require('./db1');
const validation = require('./validate1');
const user = require('./user1');
const bcrypt = require('bcrypt');

main()
.then(()=>{
  console.log("DB connected");

  app.listen(3000,()=>{
    console.log("at port 3000");
  })

  app.post("/reg",async(req,res)=>{
    try {
      validation(req.body);
      req.body.password = await bcrypt.hash(req.body.password,10);
      await user.create(req.body);
      res.send("Added");
    } catch (error) {
      res.send(error.message);
    }
  });

  app.post("/log",async(req,res)=>{
    try {
      const people = await user.findById(req.body._id);
      if(!req.body.email === people.email){
        throw new Error("Invalid login");
      }
      const pass = await bcrypt.compare(req.body.password,people.password);
      if(!pass){
        throw new Error("Invalid login");
      }
      else{
        res.send("Login Sucessfully");
      }
    } catch (error) {
      res.send(error.message);
    }
  });

  app.get("/user",async(req,res)=>{
    try {
      const ans = await user.find({});
      res.send(ans)
    } catch (error) {
      res.send(error.message)
    }
  });

  app.get("/user/:id",async(req,res)=>{
    try {
      const id = req.params.id;
      const ans = await user.findById(id);
      res.send(ans);
    } catch (error) {
      res.send(error.message);
    }
  });

  app.put("/user/:id",async(req,res)=>{
    try {
      const id = req.params.id;
      const user_id = await user.findByIdAndUpdate(id,
        {$set:{name:req.body.name,
                age:req.body.age
        }}
      )
      if(user_id){
        res.send("updated");
      }
      else{
        res.send("Not found");
      }
    } catch (error) {
      res.send(error.message);
    }
  });

  app.delete("/user/:id",async(req,res)=>{
    try {
      const id = req.params.id;
      const user_id = await user.findByIdAndDelete(id);
      if(user_id){
        res.send("Deleted");
      }
      else{
        res.send("Not found");
      }
    } catch (error) {
      res.send(error.message);
    }
  });

})
.catch((err)=>console.log(err.message));
