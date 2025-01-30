const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const express = require("express");
const session = require("express-session");
const passport = require("passport"); //Setup for passport to allow for cookies and sessions for the site
const User = require('./models/User');

const app = express();
app.use(express.json());

app.use(session({ 
    secret: 'your_secret_key', 
    resave: false, 
    saveUninitialized: false
  }));

//Database setup
main().catch(console.error);
async function main() {
    await mongoose.connect("mongodb://localhost/Assignment3");
    console.log('Connected to MongoDB');

    const userSchema = new mongoose.Schema({
        username: {type: String, required: true, unique: true },
        password: { type: String, required: true}
    });

    //Middleware to hash the password before saving the user
    userSchema.pre('save', async function (next) {
        if(!this.isModified('password')) return next();
        try{
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
            next();
        } catch(error){
            next(error);
        } 
    });

    //Method to compare input password with hashed password
    userSchema.methods.comparePassword = async function (candidatePassword) {
        return await bcrypt.compare(candidatePassword, this.password);
    };

    const User = mongoose.model('User', userSchema);
    model.exports = User;
}

app.use(passport.initialize()); //initialize passport
app.use(passport.session()); //use of passport

app.post('/login', passport.authenticate('local'), (req, res) => {
    res.send('Logged in successfully');
})

app.post('/register', async (req, res) => {
    try{
        const { username, password } = req.body;
        const newUser = new User({ username, password });
        await newUser.save();
        res.send('User registered successfully');
    } catch(error){
        res.status(500).send(error.message);
    }
});

app.get('/loggout', (req,res) => {
    req.logout();
    res.send('Logged out successfully');
});

app.get('/profile', (req, res) => {
    if(!req.isAuthenticated()) return res.status(401).send('You are not authenticated');
    res.send(`Hello ${req.use.username}`);
});