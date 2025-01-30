const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

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

main().catch(console.error);
