import express from 'express'
import loginController from '../controllers/loginController.js'
const loginRouter = express.Router()


loginRouter.post('/', loginController.login)
loginRouter.post('/logout', loginController.logout)
loginRouter.get('/refresh', loginController.getRefreshToken)

export default loginRouter