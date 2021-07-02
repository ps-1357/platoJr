const Student = require('../model/Student');
const Teacher = require('../model/Teacher');
const Admin = require('../model/Admin');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

//handle errors user
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { name:'', email:'', password: '', profession: ''}

    //incorrect email
    if(err.message === 'incorrect email'){
        errors.email = 'that email is not registered'
    }

    //incorrect password
    if(err.message === 'incorrect password'){
        errors.password = 'that password is incorrect'
    }

    //dupilcate error code
    if(err.code === 11000){
        errors.email = 'that email is already registered'
        return errors;
    }

    //validation errors
    if(err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({properties}) =>{
            errors[properties.path] = properties.message;
        });
    }

    return errors;
}

//JWT
const maxAge = 3*24*60*60;
const createToken = (id)=>{
    return jwt.sign({ id }, 'plato Jr secret', {
        expiresIn: maxAge
    });
}
//checking email across different models
//const checkEmail =  async (email) =>{
//    const result = await this.findOne({email});
//    if(!result){
//        return 'That email is already registered'
//    }
//}

module.exports.signup_get = (req,res) =>{
    res.render('signup');
}

module.exports.login_get = (req,res) =>{
    res.render('login');
}

module.exports.signup_post = async (req,res) =>{
    const {name, email, password, profession } = req.body;
    
    if(profession == 'Student') {
        try {
            const result = await Teacher.findOne({email});
            if(!result){
            const user = await Student.create({name, email, password, profession});
            const token = createToken(user._id);
            res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge*1000});
            res.status(201).json({user: user._id});
            }
            else{
                return 
            }
            
        }
        catch (err) {
            const errors = handleErrors(err);
            res.status(400).json({ errors });
        }
    }else if(profession == 'Teacher') {
        try {
            const user = await Teacher.create({name, email, password, profession});
            const token = createToken(user._id);
            res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge*1000});
            res.status(201).json({user: user._id});
        }
        catch (err) {
            const errors = handleErrors(err);
            res.status(400).json({ errors });
        }
    }
}

module.exports.signup_admin_post = async (req,res) =>{
    const {name, email, password, profession } = req.body;
    try {
            
        const user = await Admin.create({name, email, password, profession});
        const token = createToken(user._id);
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge*1000});
        res.status(201).json({user: user._id});
    }
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}
    


module.exports.login_post = async (req,res) =>{
    const { email, password, profession } = req.body;

    if(profession === 'student'){
        try{
            const user = await Student.login(email, password, profession);
            const token = createToken(user._id);
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge*1000});
        res.status(200).json({ user: user._id});
        }
    catch(err){
        const errors = handleErrors(err);
        res.status(400).json({ errors });
        }
    }
    else if (profession === 'Teacher') {
        try{
            const user = await Teacher.login(email, password, profession);
            const token = createToken(user._id);
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge*1000});
        res.status(200).json({ user: user._id});
        }
    catch(err){
        const errors = handleErrors(err);
        res.status(400).json({ errors });
        }
    }
    
}
module.exports.logout_get = (req,res) => {
    res.cookie('jwt', '',{maxAge:1});
    res.redirect('/');
}

module.exports.forgotPassword = async (req,res,next) => {
    //Getting user based on email
    const student = await Student.findOne({email: req.body.email});
    const teacher = await Teacher.findOne({email: req.body.email});
    const user = Student ? Student: Teacher;
    if(!user) {
        return next(new AppError('There is no user with this email address.', 404));
    }

    //Generating random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save();

}
module.exports.resetPassword = (req,res,next) => {
    
}
