const recipesRouter = require('./controllers/recipes')
const express = require('express')
const app = express()

app.use('/api/recipes', recipesRouter)

module.exports = app
