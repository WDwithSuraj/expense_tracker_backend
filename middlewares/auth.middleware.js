const BlacklistModel = require("../models/blacklist.model");
const jwt = require("jsonwebtoken")
require("dotenv").config()
const auth = async (req, res, next) => {

    const token = req.headers.authorization?.split(" ")[1] || null;

    try {
        if (!token) {
            return res.status(400).send({ msg: "Acess denied! Provide token." })
        }

        const existingToken = await BlacklistModel.find({ blacklist: { $in: token } })

        if (existingToken.length) {
            return res.status(400).send({ msg: "Please Login again" })
        }

        jwt.verify(token, process.env.PRIVATE_KEY, (err, result) => {
            if (err) {
                res.status(400).send({ msg: "Invalid token!" })
            } else {
                req.user = result
                next()
            }
        })
    } catch (error) {
        res.status(500).send({ msg: error.message })
    }
}


module.exports = auth;