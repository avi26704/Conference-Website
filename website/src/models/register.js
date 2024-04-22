const mongoose=require('mongoose');

const dataSchema=new mongoose.Schema({
    name:
    {
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phone:
    {
        type:Number,
        required:true,
        unique:true
    },
    password:
    {
        type:String,
        required:true
    }
})

const registers=mongoose.model("registration",dataSchema);

module.exports=registers;