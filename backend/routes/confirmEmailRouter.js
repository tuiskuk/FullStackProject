import express from 'express'
import confirmEmailController from '../controllers/confirmEmailController.js'
const confirmEmailRouter = express.Router()


confirmEmailRouter.get('/:emailToken', confirmEmailController.confirmEmail)

export default confirmEmailRouter