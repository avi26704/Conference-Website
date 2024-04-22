const mongoose=require("mongoose");

mongoose.connect("mongodb://localhost:27017/Conference_Website",{
    // useNewUrlParser:true,
    // useUnifiedTopology:true,
    // useCreateIndex:true
})
.then(()=>{
    console.log("Database Connection Established");
})
.catch((e)=>{
    console.log('error');
})