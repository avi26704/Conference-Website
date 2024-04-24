const express=require("express");
const app=express();
const port=process.env.PORT || 5000;
require("../src/db_connection/connectDB");
const path=require("path");
const register=require("../src/models/register");
const multer  = require('multer')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
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


app.get("/paperSubmission",(req,res)=>{
    res.render("paperSubmission",{message:""});
})

app.post("/paperSubmission",upload.single("uploadedFile"),(req,res)=>{
    try {
        if(req.body.tracks==="select"){
            res.status(400).render("paperSubmission",{message:"Please Select a Track"});
        }
        else if(req.body.personname===''){
            res.status(400).render("paperSubmission",{message:"Please provide a valid Name"});
        }
        else if(!req.file){
            res.status(400).render("paperSubmission",{message:"Please provide a valid File"});
        }
        else{ res.status(200).redirect("/paperSubmitted");}
    } catch (err) {
        res.status(400).send("Some Error occurred...Please Re-Upload the file.");
    }
})


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
        const re = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
        const re2=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if(!re.test(req.body.phone)){
            res.status(400).render("signup",{message:"",error:"Invalid Phone Number"});
        }
        else if(!re2.test(req.body.email)){
            res.status(400).render("signup",{message:"",error:"Invalid Email Id"});
        }
        else{
            const registered=await regData.save();
            res.status(201).render("signup",{message:"User Registered Successfully!",error:""})
        }
  {
    return (true)
  }
    } catch (err) {
        res.status(400).render("signup",{message:"",error:"Some Error Occurred...Please Retry."})
        console.log(err);
    }
})

app.get("/paperSubmitted",(req,res)=>{
    res.render("paperSubmitted");
})