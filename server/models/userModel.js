const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
 
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'This field is required'   
    },
    email: {
        type: String,
        required: 'This field is required' 
    },
    username: {
        type: String,
        unique: true,
        required: true 
    },
    password: {
        type: String,
        required: 'This field is required' 
    }
});

//Middleware to hash the password before saving to the database
userSchema.pre("save", function (next) {
    const user = this;

    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(function (saltError, salt) {
            if (saltError) {
                return next(saltError);
            } else {
                bcrypt.hash(user.password, salt, function(hashError, hash) {
                    if (hashError) {
                        return next(hashError);
                    }
                    user.password = hash;
                    next();
                })
            }
        }) 
    } else {
        return next();
    }
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;