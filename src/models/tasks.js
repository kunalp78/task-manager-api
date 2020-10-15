const mongoose = require('mongoose')
const taskSchema = mongoose.Schema({
    desc:{
        type:String,
        required:true,
    },
    completed:{
        type:Boolean,
        default:false
    },
    owner:{
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'User'
    }
},{
    timestamps:true
})
const Tasks = mongoose.model('tasks',taskSchema)

module.exports = Tasks