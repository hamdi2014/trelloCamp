const mongoose = require('mongoose');
const bcrypt=require('bcryptjs');

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    // TODO: Hash the password
    password: {
        type: String,
        required: true,
        trim: true,
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
    }
});

userSchema.pre('save',async function(next){
    if(!this.isModified("password")) return next();
    try{
        this.password=bcrypt.hashSync(this.password,bcrypt.genSaltSync(10));
        return next()
    }catch(error){
        next(error)
    }
});

// userSchema.methods.passMatch=function(pass){
//     return bcrypt.compareSync(pass,this.password)
// }
module.exports = mongoose.model('User', userSchema);

