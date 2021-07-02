const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt')

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your full Name']
    },
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [8, 'Minimum password length is 8 characters']
    }

});

//fire a function before doc saved to DB
adminSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

//Static method to login admin
adminSchema.statics.login = async function(email,password) {
    const admin = await this.findOne({email});
    if(admin){
        auth =await bcrypt.compare(password, admin.password);
        if(auth){
            return admin;
        }
        throw Error('incorrect password');
    }
    throw Error('incorrect email');
}

const Admin = mongoose.model('admin', adminSchema);

module.exports = Admin;
