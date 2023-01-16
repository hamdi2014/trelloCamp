const mongoose=require('mongoose');

const taskSchema=mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status:{
        type:String,
        enum:['todo','doing','done'],
        required:true
    },
    members:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    }]
})

module.exports=mongoose.model('Task',taskSchema)