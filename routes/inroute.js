
const express = require('express');
const router = express.Router();
const User = require('../models/dburl'); 
const bcrypt=require("bcrypt");


router.post('/signin', async (req, res) => {
   const {email,password}=req.body
   let token;
  try {
    
      const existuser=await User.findOne({email: email});
      if (!existuser){
        return res.status(401).json("User does not exist");
    }
       const matchPassword=await bcrypt.compare(password, existuser.password);
        
       if(!matchPassword){
        return res.status(400).json( "Wrong Password")
       }
       //create token
       token=await existuser.generateAuthtoken();
       res.cookie("logintoken",token,{
           expires:new Date(Date.now() + 3600000),
           httpOnly:false,
       })
       res.status(201).redirect(`/?${token}`)
  } catch (error) {
    console.error(error);
    
  }
});

module.exports = router;
