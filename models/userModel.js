const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const asyncHandler = require('express-async-handler');
// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        
    },
    lastName:{
        type:String,
        required:true,
        
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    phone:{
        type:String,
        required:true,
        unique: true,
    },
    
    role: {
        type: String,
        default: 'user',
        required: true
    },
    isBlocked: {
        type: Boolean,
        default: false,

    },
    areaOfExpertise: String,
    token: String,
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    
},

    {
        timestamp: true
    }
);


userSchema.pre('save', async function(next){
  if(!this.isModified('password')){
    next();
  }
  const salt = bcrypt.genSaltSync(10);
  this.password = await bcrypt.hash(this.password, salt);
    next();
});
userSchema.methods.isPasswordMatched = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
}
userSchema.methods.createPasswordResetToken = async function(){
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)   
    .digest("hex")
    this.passwordResetExpires = Date.now() + 30 *60 * 1000 // 30 minutes
    return resetToken;
}

module.exports = mongoose.model('User', userSchema);