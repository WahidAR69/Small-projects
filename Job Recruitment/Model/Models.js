const mongoose = require('mongoose');

let signUpSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, validate: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/},
    password: { type: String, required: true },
    isEmployer: {type: String, enum: ['Yes', 'No']}
});
let loginSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true }
});

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    requirements: { type: String, required: true },
    location: { type: String, required: true },
    apply: { type: String},
    hiddenUser: { type: String, required: true }
});




const SignUp = mongoose.model('SignUp', signUpSchema);
const Login = mongoose.model('Login', loginSchema);
const Job = mongoose.model('Job', jobSchema);

module.exports = { SignUp, Login, Job };