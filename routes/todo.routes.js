const Router = require("express");
const Todo = require("../models/Todo")
const User = require("../models/User")
const router = new Router()
const authMiddleware = require('../middleware/auth.middleware')

router.post('/',
    authMiddleware,
    async (req, res) => {
        try {
            const { id } = req.user

            const user = await User.findById(id)
            if(!user){
                return res.status(404).json({error: "User not found"})
            }

            const { title, description } = req.body

            if(!title || !description) {
                return res.status(400).json({error:"Fields don`t must have empty values"})
            }

            const candidateTodo = await Todo.findOne({title})
            if(candidateTodo){
                return res.status(400).json({error:"Todo with this title Already exist"})
            }

            const todo = new Todo({
                title,
                description,
                status: false,
                userId: id
            })
            await todo.save()
            return res.status(200).json({todo})
        } catch (e) {
            return  res.status(400).json({
                error: e.message
            })
        }
    })

router.get('/',
    authMiddleware,
    async (req, res) => {
        try {
            const { id } = req.user

            const user = await User.findById(id)
            if(!user){
                return res.status(404).json({error: "User not found"})
            }

            const todos = await Todo.find({userId: id})

            return res.status(200).json({todos})
        } catch (e) {
            res.status(400).json({error: "Server error"})
        }
    })

router.delete('/:todoId',
    authMiddleware,
    async (req, res) => {
        try {
            const { id } = req.user

            const user = await User.findById(id)
            if(!user){
                return res.status(404).json({error: "User not found"})
            }

            const { todoId } = req.params

            const todo = await Todo.findById(todoId)
            if(!todo){
                return res.status(404).json({error: "Todo not found"})
            }
            await Todo.findByIdAndDelete(todoId)

            return res.status(200).json({message:"Deleted"})
        } catch (e) {
            res.status(400).json({error: "Server error"})
        }
    })

router.delete('/clear/all',
    authMiddleware,
    async (req, res) => {
        try {
            const { id } = req.user

            const user = await User.findById(id)
            if(!user){
                return res.status(404).json({error: "User not found"})
            }


            await Todo.deleteMany({userId: id})

            return res.status(200).json({message:"Deleted"})
        } catch (e) {
            console.log(e)
            res.status(400).json({error: "Server error"})
        }
    })

router.put('/:todoId',
    authMiddleware,
    async (req, res) => {
        try {
            const { id } = req.user

            const user = await User.findById(id)
            if(!user){
                return res.status(404).json({error: "User not found"})
            }

            const { todoId } = req.params

            const todo = await Todo.findById(todoId)
            if(!todo){
                return res.status(404).json({error: "Todo not found"})
            }

            if(req.body.title) {
                todo.title = req.body.title
            }
            if(req.body.description) {
                todo.description = req.body.description
            }
            if(req.body.status !== undefined) {
                todo.status = req.body.status
            }

            await todo.save()
            return res.status(200).json({todo})
        } catch (e) {
            return res.status(400).json({error: "Server error"})
        }
    })

module.exports = router