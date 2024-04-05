const express = require('express');
const router = express.Router();
const User = require('../models/dburl'); 

router.post('/signin', async (req, res) => {
   const { email, password } = req.body;
   let token;
   
   try {
      const existUser = await User.findOne({ email: email });
      
      if (!existUser) {
         return res.status(401).json("User does not exist");
      }
      
      // Compare passwords (alternative method to bcrypt)
      if (existUser.password !== password) {
         return res.status(400).json("Wrong Password");
      }
      
      // If password matches, proceed to token generation
      token = await existUser.generateAuthtoken();
      
      // Set cookie with token
      res.cookie("logintoken", token, {
         expires: new Date(Date.now() + 3600000),
         httpOnly: false,
      });
      
      // Redirect with token
      res.status(201).redirect(`/?${token}`);
   } catch (error) {
      console.error(error);
      res.status(500).json("Internal Server Error");
   }
});

module.exports = router;
