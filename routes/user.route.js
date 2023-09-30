const userRouter = require("express").Router();
const bcrypt = require("bcrypt");
const UserModel = require("../models/user.model")
const BlacklistModel = require("../models/blacklist.model")
require("dotenv").config();


userRouter.post("/register", async (req, res) => {
    const { email, password } = req.body
    try {
        const existinUser = await UserModel.findOne({ email })
        if (existinUser) {
            res.status(400).send({ msg: "User already exists! Please login" })
        } else {
            const salt = await bcrypt.genSalt(Number(process.env.SALT))
            const hashedPassword = await bcrypt.hash(password, salt)

            let newUser = await new UserModel({
                ...req.body,
                password: hashedPassword
            }).save();

            res.status(200).send({ data: newUser, message: "User created successfully" })
        }


    } catch (error) {
        res.status(500).send({ msg: "Internal Server Error" })
    }
})


userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body
    try {
        const existingUser = await UserModel.findOne({ email });
        if (!existingUser) {
            return res.status(400).send({ message: "Invalid email and passoword" })
        }

        const validPassword = await bcrypt.compare(password, existingUser.password);
        if (!validPassword) {
            return res.status(400).send({ message: "Invalid password" })
        }

        const token = existingUser.generateAuthToken();
        res.status(200).send({ message: "Login sucsessfull!", token, existingUser })

    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})


userRouter.post("/logout", async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (token) {
            // Find the document and push the token into the blacklist array
            await BlacklistModel.findOneAndUpdate(
                {},
                { $push: { blacklist: token } },
                { upsert: true } // Create the document if it doesn't exist
            );
            res.status(200).send({ msg: "Logout successful" });
        }
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
})


module.exports = userRouter