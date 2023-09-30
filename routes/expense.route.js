const expenseRouter = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const ExpenseModel = require("../models/expense.model");
const UserModel = require("../models/user.model");
expenseRouter.use(auth)


expenseRouter.post("/add", async (req, res) => {
    const { user } = req
    try {
        const expense = await new ExpenseModel({
            ...req.body,
            user
        }).save()
        res.status(200).send({ msg: "Expenss has been added", data: expense })
    } catch (error) {
        res.status(400).send({ msg: error.message })
    }
})


expenseRouter.get("/", async (req, res) => {
    const { user } = req
    try {
        const expenses = await ExpenseModel.find({ user })
        res.status(200).send({ data: expenses })
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})


expenseRouter.get("/:id", async (req, res) => {
    const { id } = req.params
    const { user } = req
    try {
        const expense = await ExpenseModel.findOne({ _id: id, user })
        res.status(200).send({ data: expense })
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})


expenseRouter.delete("/delete/:id", async (req, res) => {
    const { id } = req.params
    const { user } = req
    try {
        const expense = await ExpenseModel.findOne({ _id: id, user })
        await ExpenseModel.findByIdAndDelete({ _id: id })
        res.status(200).send({ msg: "Expense has been deleted" })
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})

expenseRouter.put("/update/:id", async (req, res) => {
    const { id } = req.params
    const { user } = req
    try {
        const expense = await ExpenseModel.findOne({ _id: id, user })
        const updatedExpense = await ExpenseModel.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).send({ data: updatedExpense, msg: "Expense updated succsessfully" })
    } catch (error) {
        res.status(400).send({ error: error.message })
    }
})


module.exports = expenseRouter;