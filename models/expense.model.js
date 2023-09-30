const mongoose = require("mongoose");


const expenseSchema = mongoose.Schema({
    description: { type: String, required: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: String, required: true },
    user: { type: String, required: true }
}, {
    versionKey: false
})


const ExpenseModel = mongoose.model("expenses", expenseSchema)

module.exports = ExpenseModel