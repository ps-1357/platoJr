const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const studentSchema = new mongoose.Schema({
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
    },
    profession: {
        type: String,
        default: 'student'
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date
});


//fire a function before doc saved to DB
studentSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

//Static method to login student
studentSchema.statics.login = async function(email,password) {
    const student = await this.findOne({email});
    if(student){
        auth =await bcrypt.compare(password, student.password);
        if(auth){
            return student;
        }
        throw Error('incorrect password');
    }
    throw Error('incorrect email');
}

studentSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetExpires = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

        console.log({resetToken}, this.passwordResetToken)

        this.passwordResetExpires = Date.now() + 10*60*1000;
    return resetToken;
}

const Student = mongoose.model('student', studentSchema);

module.exports = Student;