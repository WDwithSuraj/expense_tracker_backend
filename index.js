const express = require('express');
const connection = require("./config/db")
const userRouter = require("./routes/user.route");
const expenseRouter = require('./routes/expense.route');
const cors = require("cors")
const app = express();
require("dotenv").config()

app.use(express.json())
app.use(cors())
app.use("/user", userRouter)
app.use("/expense", expenseRouter)


app.use("/", (req, res) => {
    res.json({ "msg": "Expense Tracker API" })
})


app.listen(8080, async () => {
    await connection;
    console.log("server is running..")
    console.log("db is connected")
})
