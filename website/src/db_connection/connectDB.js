const mongoose=require("mongoose");

mongoose.connect("mongodb://localhost:27017/Conference_Website",{
})
.then(()=>{
    console.log("Database Connection Established");
})
.catch((e)=>{
    console.log('error');
})