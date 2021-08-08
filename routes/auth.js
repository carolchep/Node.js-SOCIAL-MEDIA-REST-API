const router=require("express").Router();
const User = require("../models/User");
const bcrypt=require("bcrypt")
router.post("/register",async (req,res)=>{
    
    try{
        //generate password
        const salt=await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(req.body.password,salt)
       //create new user
        const newUser=new User({
            username:req.body.username,
            email:req.body.email,
            password:hashedPassword,
        })
        //save  user return response
        const user=await newUser.save();
        res.status(200).json(user);

    }catch(err){
        res.status(500).json(err)
        
    }
    
})
//login
router.post("/login",async(req,res)=>{
    try{
        //searchrs for the email
        const user=await User.findone({email:req.body.email.body});
        //if user doesnt exists
        !user&&res.status(404).json("user not found")
        //compare password to see if valid
        const validPassword=await bcrypt.compare(req.body.password,user.password)
        //if user enters an invald password
        !validPassword && res.status(400).json("wrong password")
        //if user enters a valid password and email 
        res.status(200).json(user)
    }catch(err){
        res.status(500).json(err)
    }
})









module.exports=router