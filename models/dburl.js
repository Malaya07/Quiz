
const mongoose = require("mongoose");
const jwt=require("jsonwebtoken")
const SECRET_KEY="PRACTICE"

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        
        
    },
    password: {
        type: String,
        required: true,
        // Add validation for password
        minlength: 6, // Example: Minimum password length of 6 characters
    },
    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
    ],
  
}, { timestamps: true });
//token
userSchema.methods.generateAuthtoken =  async function(){
  try {
      let token=jwt.sign({id:this._id}, SECRET_KEY);
      this.tokens=this.tokens.concat({ token: token });
      await this.save();
      
      return token;
  } catch (error) {
    console.log(error);
  }
}

const User = mongoose.model('User', userSchema);

module.exports = User;
