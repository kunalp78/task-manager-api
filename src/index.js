const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user');
const tasksRouter = require('./routers/tasks');

const app = express();
const port = process.env.PORT;




app.use(express.json());
app.use(tasksRouter);
app.use(userRouter);
//Bapu
app.listen(port,()=>{
    console.log('Server is up and running',port);
})
// app.use((req, res, next)=>{
//     // console.log(req.method, req.path)
//     req.method ? res.status(503).send("Website under Maintainance") : next()
    
// })
// 
// const jwt = require('jsonwebtoken');

// const myFunction = async () =>{
//    const token = jwt.sign({ _id: 'abc123' }, 'thisismynewcourse', { expiresIn: '1 seconds' });
//    console.log(token)

//    const data = jwt.verify(token, 'thisismynewcourse')
//     console.log(data)
// }

// myFunction()
// const Task = require('./models/tasks');
// const main = async () =>{
//     const task = await Task.findById('5f871f584d4a051850d73d6d');
//     await task.populate('owner').execPopulate();
//     console.log(task.owner)
// }
// main()
// async function f() {

//     let promise = new Promise((resolve, reject) => {
//       setTimeout(() => resolve("done!"), 1000)
//     });
  
//     let result =  await promise; // wait until the promise resolves (*)
  
//     console.log(result); // "done!"
//     //result =  promise;
    
//   }
  
//   f();
//   console.log("result")

//const multer = require('multer');
// const upload = multer({
//     dest:'images',
//     limits:{
//         fileSize: 1000000
//     },
//     fileFilter(req, file, cb){
//         if(!file.originalname.match(/\.(doc|docx)$/)) {  //.endsWith('.png')
//         return cb(new Error('File must be document type'))
//     }
//         cb(undefined, true)
//         // cb(new Error('File must be image'))
//         // cb(undefined,true)
//         // cb(undefined,false)
//     }
// });
// app.post('/upload',upload.single('upload'),(req, res)=>{
//     res.send()
// })