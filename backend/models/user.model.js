const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdOn: { type: Date, default: Date.now }, // Corrected 'creatOn' to 'createdOn'
});

// Corrected 'MediaSourceHandle.expoets' to 'module.exports'
module.exports = mongoose.model("User", userSchema); // Changed "user" to "User" for consistency
