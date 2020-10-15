const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const { sendWelcomeEmail, sendGoodByeEmail } = require('../emails/account');
const auth = require('../middleware/auth');
const User = require('../models/user');
const router = new express.Router();



router.post("/users/login", async (req, res)=>{
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({ user, token });
    }catch(e){
        res.status(400).send({'error':'invalid'})
    }
})
router.post("/users/logout", auth, async (req, res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        });
        await req.user.save();

        res.send()
    }catch(e){
       res.status(500).send(e);
    }
})

router.post("/users/logAllOut", auth, async (req, res)=>{
    try{
        req.user.tokens = []
        await req.user.save();
        res.status(200).send();
    }catch (e){
        res.status(500).send(e)
    }
})

router.post("/users",async (req, res)=>{
    const user = new User(req.body);
    try{
        await user.save();
        console.log(user.email)
        
        const token = await user.generateAuthToken();
        //sendWelcomeEmail(user.email, user.name)
        res.status(201).send( { user, token } );
    }
    catch(e){
        res.status(400).send(e);
    }
    
})
router.get("/users/me", auth, async (req, res)=>{
    res.send(req.user)
   // User.find({}).then(user=>res.status(201).send(user)).catch(e=>res.status(500).send(e));
})
router.get("/users/:id",async (req,res)=>{
    const _id = req.params.id;
    try{
        const user = await User.findById(_id);
        !user ? res.status(404).send("Page Not Found") : res.status(201).send(user);
    }
    catch(e){
        res.status(500).send(e);
    }
    //User.findById(_id).then(user=>!user?res.status(404).send():res.status(201).send(user)).catch(e=>res.status(500).send(e));
})
router.patch("/users/me", auth, async (req , res)=>{
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name","age","password","email"];
    const isValidOperation = updates.every(updates=>allowedUpdates.includes(updates));
    if(!isValidOperation){
        return res.status(400).send({error: 'Invalid Updates'});
    }
    try{
        // const user = await User.findById(req.params.id,{ runValidators: true });
        updates.forEach((update) => {
            req.user[update] = req.body[update]
            //console.log(req.user[update])
        });
        await req.user.save();
        
       // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        !req.user ? res.status(404).send("Page Not Found") : res.status(201).send(req.user);
    }catch(e){
        res.status(400).send(e);
    }
})
router.delete("/users/me",auth ,async (req, res)=>{
    try{
        // const user = await User.findByIdAndDelete(req.params.id);
        // !user ? res.status(404).send("Page Not Found") : res.status(201).send(user);
        await req.user.remove();
        //sendGoodByeEmail(req.user.email, req.user.name)
        res.status(201).send(req.user)
    }catch(e){
        res.status(500).send(e);
    }
})
const upload = multer({
    limits:{
        fileSize: 1000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error("file must be of jpg or jpeg or png format"))
        }
        cb(undefined, true)
    }
})
router.post("/users/me/avatar", auth,upload.single('avatar'),async (req, res)=>{
    const buffer = await sharp(req.file.buffer).resize({ width:250, height:250 }).png().toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
},(error, req, res, next)=>{
    res.status(400).send({
        error: error.message
    })
})
router.get("/users/:id/avatar", async (req, res)=>{
    try{
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar){
            throw new Error()
        }
        res.set('Content-Type','image/png');
        res.send(user.avatar)
    }catch(e){
        res.status(404).send(e)
    }
})
router.delete("/users/me/avatar", auth, async (req, res)=>{
    try
    {   if(req.user.avatar !== undefined){
            req.user.avatar = undefined
            await req.user.save()
            res.status(200).send()
        }else{
            throw new Error()
        }
        
    }catch(e){
        res.status(400).send(e)
    }
})
module.exports = router