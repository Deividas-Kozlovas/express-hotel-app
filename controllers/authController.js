const User = require('../models/userModels');
const jwt = require('jsonwebtoken');
const promisify = require('promisify');
const { response } = require('../app');


const singToken = (id) => {
    return jwt.sign({id:id},
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_EXPIRES_IN},
    )
}

exports.singup = async(req,res)=>{
    try{
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm,
        })

        const token = jwt.sign(
            {id: newUser._id},
            process.env.JWT_SECRET,
            {expiresIn: process.env.JWT_EXPIRES_IN},
        )
        res.status(201).json({
            status: "Success",
            data: newUser,
            token
        })
    }catch(err){
        res.status(400).json({
            status: "Failed",
            message: err.message
        })
    }
}

exports.login = async (req, res)=>{
    try{
        const {email, password} = req.body;
    
        // Check if email and password exist
        if(!email || !password){
            throw new Error("Please provide email and password")
        }
    
        // Check is user exist and is password correct
        const user = await User.findOne({email}).select('+password');
        if(!user || !(await user.correctPassword(password, user.password))){
            throw new Error("Incorect email or password")
        }
    
        const token = singToken(user.id);
    
        // If everything is ok, send data to client
    
        res.status(201).json({
            data:{
                id: user.id,
                name: user.name,
                email: user.email,
            },
            token
        })
    }catch(err){
        res.status(400).josn({
            response: "Failed",
            message: err.message
        })
    } 
}

exports.protect = async(req, res, next) =>{
    // Get token
    let token;

    try{
        if(req.headers.authorization && req.headers.authorization.startWith('Bearer')){
            token = req.headers.authorization.split(' ')[1]
        }
        if(!token){
            throw new Error('User not authenticated')
        }

        // Token verification
        const decoded = await promisify(jwt.verify)(token,process.env.JWT_SECRET)
        
        // Check use in database 
        const currentUser = await User.findById(decoded.id);

        if(!currentUser){
            throw new Error('Used do not exist')
        }

        // Check user change password after token was issued
        if(currentUser.changePasswordAfter(decoded.iat)){
            throw new Error('User change password')
        }

        // Grandt access
        req.user = currentUser
        next();
    }catch(err){
        res.status(400).json({
            response: "Failed",
            error: err.message
        })
    }

}