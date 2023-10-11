const mongoose = require("mongoose");

const user_schema = new mongoose.Schema({
	firstName: {
        type: String,
        required: [true, "First name is required!"]
    },
    lastName: {
        type: String,
        required: [true, "Last name is required!"]
    },
    age: {
        type: Number,
        required: [true, "Age is required!"]
    },
    email: {
        type: String,
        required: [true, "E-mail is required!"]
    },
    password: {
        type: String,
        required: [true, "Password is required!"]
    },
    mobileNo: {
        type: String,
        required: [true, "Mobile Number is required!"]
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    registeredOn: {
        type: Date,
        default: new Date()
    }
});

module.exports = mongoose.model("User", user_schema);