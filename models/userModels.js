const mongoose = require('mongoose');
const validator = require('validator');
const brcypt = require('bcryptjs');
const { validate } = require('./hotelModel');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, "Please insert name"]
    },
    email: {
        type: String,
        require: [true, "Please insert your email"],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'is not email']
    },
    photo: {
        type: String
    },
    password: {
        type: String,
        require: [true, "Please insert your password"],
        minlength: 8,
        select: false,
    },
    passwordConfirm: {
        type: String,
        require: [true, "Please confirm your password"],
        minlength: 8,
        validate: {
            validator: function(el){
                return el == this.password
            },
            message: "Passwords are not the same"
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active:{
        type: Boolean,
        default: true,
        select: false,
    }
})

userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        return next()
    }

    // hash password with cost 12
    this.password = await brcypt.hash(this.password, 12)
    this.passwordConfirm = undefined
    next()
})

userSchema.methods.correctPassword = async (candidatePassword,userPassword) =>{
    return await brcypt.compare(candidatePassword,userPassword);
}

userSchema.methods.changedPasswordAfter = function(JWTTimestamp){
    if(this.passwordChangedAt){
        const changeTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000.10
        )

        return JWTTimestamp < changeTimestamp;
    }
}

const User = mongoose.model('User', userSchema);

module.exports = User;