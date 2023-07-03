const express = require('express')
const recipesRouter = require('./controllers/recipes')

const app = express()

app.use('/api/recipes', recipesRouter)

module.exports = app
