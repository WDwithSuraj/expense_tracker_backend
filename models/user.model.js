const mongoose = require("mongoose");
const jwt = require("jsonwebtoken")

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
}, {
    versionKey: false
})


userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign(
        { _id: this._id, name: this.name },
        process.env.PRIVATE_KEY,
    );
    return token;
};


const UserModel = mongoose.model("users", userSchema)

module.exports = UserModel