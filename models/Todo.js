const {Schema, model} = require("mongoose")

const Todo = new Schema({
    title: {type: String},
    description: {type: String},
    status: {type: Boolean},
    userId: {type: String},
})

module.exports = model('Todo', Todo)