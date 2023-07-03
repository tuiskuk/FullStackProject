const express = require('express')
const cors = require('cors')
const recipesRouter = require('./controllers/recipes')

const app = express()

app.use(cors())
app.use('/api/recipes', recipesRouter)

module.exports = app
