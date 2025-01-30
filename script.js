const mongoose = require("mongoose");
const express = require("express");
const session = require("express-session");
const passport = require("./passportConfig"); //Setup for passport to allow for cookies and sessions for the site
const User = require('./User');

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
