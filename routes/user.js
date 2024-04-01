
const express = require('express');
const router = express.Router();
const User = require('../models/dburl'); 
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken")
const SECRET_KEY="PRACTICE"


router.post('/', async (req, res) => {
  const {name , email , password}=req.body;
  try {
      const exitinguser= await User.findOne({ email: email });
      if(exitinguser){
       return res.status(400).json({ msg:'Email already registered'});
     }
      const hashedpassword= await bcrypt.hash(password,10);
      const data= await User.create({
        name : name,
        email :email,
        password:hashedpassword,
      })
      const token=jwt.sign({email : data.email, id : data.id},SECRET_KEY)
      console.log(data)
      res.status(201).redirect('/signin');
 
  } catch (error) {
    console.error(error);
    
  }
});

module.exports = router;
