const express=require("express");
const app=express();
// const dotenv=require("dotenv");
const port=process.env.PORT || 5000;
require("../src/db_connection/connectDB");
const path=require("path");
const register=require("../src/models/register");
// const {json}=require("express");
const multer  = require('multer')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if(req.body.tracks==="---Select the Track---"){
            res.send("Please Select a track and then upload the document");
        }
      cb(null, `./uploaded-files/${req.body.tracks}`)
    },
    filename: function (req, file, cb) {
      cb(null, `${req.body.personname}`)
    }
  })
  const upload = multer({ storage: storage })

app.use(express.json());
app.use(express.urlencoded({extended:false}));

const static_path=path.join(__dirname,"../public");


app.use(express.static(static_path));
app.set("view engine","hbs");

app.listen(port,()=>{
    console.log("Server Started on Port 5000");
})

app.get("/home",(req,res)=>{
    res.render("home");
})

app.get("/about",(req,res)=>{
    res.render("about");
})

app.get("/ticket",(req,res)=>{
    res.render("ticket");
})

// app.post("/home",(req,res)=>{
//     res.redirect("/about");
// })

app.get("/paperSubmission",(req,res)=>{
    res.render("paperSubmission");
})

app.post("/paperSubmission",upload.single("uploadedFile"),(req,res)=>{
    try {
        if(req.body.tracks==="select"){
            res.status(400).send("Please Select a track and then upload the document");
        }
        else if(req.body.personname===''){
            res.status(400).send("Please Enter your name and then upload the document");
        }
        else if(!req.file){
            res.status(400).send("Please select the document");
        }
        else{ res.status(200).redirect("/paperSubmitted");}
    } catch (err) {
        res.status(400).send("Some Error occurred...Please Re-Upload the file.");
    }
    
})

function log(){
    app.get("/signup",(req,res)=>{
        res.redirect("/login");
    })
}

app.get("/login",(req,res)=>{
    res.render("login");
})

app.post("/login",async (req,res)=>{
    try {
        const email=req.body.email;
        const password=req.body.password;

        const User=await register.findOne({email:email});
        if(User.password===password){
            res.status(201).redirect("/paperSubmission");
        }
        else{
            res.status(400).render("login",{message:"Invalid Email or Password"});
        }
    } catch (err) {
        res.status(400).render("login",{message:"Invalid Email or Password"});
    }
})

app.get("/signup",(req,res)=>{
    res.status(200).render("signup",{message:"",error:""});
})

app.post("/signup", async (req,res)=>{
    try {

        const regData= new register({
            name:req.body.name,
            email:req.body.email,
            phone:req.body.phone,
            password:req.body.password
        })
        
        const registered=await regData.save();
        if(registered){
            res.status(201).render("signup",{message:"User Registered Successfully!",error:""})
            setTimeout(function() {
                log();
              }, 3000)
        }
  {
    return (true)
  }
    } catch (err) {
        res.status(400).render("signup",{message:"",error:"Some Error Occurred...Please Retry."})

    }
})

app.get("/paperSubmitted",(req,res)=>{
    res.render("paperSubmitted");
})