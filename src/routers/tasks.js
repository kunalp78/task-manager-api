const express = require('express');
const Tasks = require('../models/tasks');
const auth = require('../middleware/auth');
const { query } = require('express');
const router = new express.Router;

router.post("/tasks", auth, async (req,res)=>{
   // const task = new Tasks(req.body);
   const task = new Tasks({
       ...req.body,
       owner: req.user._id
   })
    try{
        await task.save();
        res.status(201).send(task);
    }
    catch(e){
        res.status(500).send(e);
    }
    //task.save().then(task=>res.status(201).send(task)).catch(e=>res.status(400).send(e));
})
//GET /tasks?completed=true
//GET /tasks?limit=2&skip=2
//GET /task?sortBy=createdAt:desc    --(descending -desc, ascending -asc)
router.get("/tasks", auth, async (req, res)=>{
    const match = {};
    const sort = {};
    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
        //console.log(parts[0])
    }
    try{
      const tasks = await Tasks.find(match ,{desc:'desc',
       owner:req.user._id },{ 
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort
    });
     
    //    await req.user.populate({
    //        path: 'tasks'
    //    }).execPopulate()
    //    console.log("hey",req.user.task)
        res.status(201).send(tasks);
    }catch(e){
        res.status(500).send(e);
    }
   //Tasks.find({}).then(task=>res.status(201).send(task)).catch(e=>res.status(500).send(e))
})
router.get("/tasks/:id", async (req,res)=>{
    const _id = req.params.id;
    try{console.log('tasks')
        const task = await Tasks.find({ owner: _id });
        !task ? res.status(404).send() : res.status(201).send(task);
    }catch(e){
        res.status(500).send(e);
    }
    // Tasks.findById(_id).then(task=>!task?res.status(404).send():res.status(201).send(task)).catch(e=>res.status(500).send(e));
})
router.patch("/tasks/:id", auth, async (req, res)=>{
    const updates = Object.keys(req.body);
    const allowedUpdates = ["desc","completed"];
    const isValidOperation = updates.every(updates=>allowedUpdates.includes(updates));
    if(!isValidOperation){
        return res.status(400).send({error: 'Invalid Request'});
    }
    try{
        const task = await Tasks.findOne({ _id: req.params.id, owner: req.user._id })
       // const task = await Tasks.findById(req.params.id,{ runValidators: true });
       
        //const task = await Tasks.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
        if(!task){
            res.status(404).send("Page Not Found") 
        }
        updates.forEach(update=>task[update]=req.body[update]);
        await task.save()
        res.status(201).send(task);
        }catch(e){
            res.status(400).send(e);
    }
})
router.delete("/tasks/:id", auth, async (req, res)=>{
    try{
        const task = await Tasks.findOneAndDelete({ _id:req.params.id, owner: req.user._id })
        //const task = await Tasks.findByIdAndDelete(req.params.id)
        !task ? res.status(404).send("Page Not Found") : res.status(201).send(task)
    }catch(e){
        res.status(500).send(e);
    }
})
module.exports = router;