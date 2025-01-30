const passport = require("passport"); //Setup for passport to allow for cookies and sessions for the site
const LocalStrategy = require('passport-local').Strategy;
const User = require('./User');

//local Strategy for authentication using username and password
passport.use(new LocalStrategy(
    async(setTheUsername, setThePassword, done) => {
        try{
            const user = await User.findOne({username});
            if(!user) return done(null, false, {message: 'Incorrect username.'});
            const isMatch = await user.comparePassword(password);
            if(!isMatch) return done(null, false, {message: 'Incorrect password.'});
            return done(null, user);
        } catch(error){
            return done(error);
        }
    }
));
passport.serializeUser((user,done) => {
    done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
    try{
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

module.exports = passport;