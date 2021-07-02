const jwt = require('jsonwebtoken');
const Student = require('../model/Student');
const Teacher = require('../model/Teacher');
const Admin = require('../model/Admin');


const requireAuth = (req,res,next)=>{
    const token = req.cookies.jwt;

    //check if json web token existts & is verified
    if(token){
        jwt.verify(token, 'plato Jr secret', (err, decodedToken)=>{
            if(err){
                console.log(err.message);
                res.redirect('/login');
            } else {
                console.log(decodedToken);
                next();
            }
        });
    }
    else{
        res.redirect('/login');
    }
}

//Check current user

const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;

    if(token) {jwt.verify(token, 'plato Jr secret', async (err, decodedToken)=>{
        if(err){
            console.log(err.message);
            res.locals.user = null;
            next();
        } else {
            console.log(decodedToken);

            let user1 = await Teacher.findById(decodedToken.id);
            let user2 = await Student.findById(decodedToken.id);
            res.locals.user = user1 ? user1 : user2;
            next();
        }
      });
    }
    else {
        res.locals.user = null;
        next();
    }

}
const checkAdmin = (req, res, next) => {
    const token = req.cookies.jwt;

    if(token) {jwt.verify(token, 'plato Jr secret', async (err, decodedToken)=>{
        if(err){
            console.log(err.message);
            res.locals.user = null;
            next();
        } else {
            console.log(decodedToken);

            let user = await Admin.findById(decodedToken.id);
            res.locals.user = user;
            next();
        }
      });
    }
    else {
        res.locals.user = null;
        next();
    }
}


module.exports = { requireAuth, checkUser, checkAdmin }
