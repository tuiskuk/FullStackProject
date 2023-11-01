import jwt from 'jsonwebtoken'
import config from '../utils/config.js'
import { User } from '../models/user.js'

const confirmEmail = async (request, response, next) => {

  try {
    console.log('inside confirm try')
    console.log(request.params.emailToken)
    const decoded = jwt.verify(request.params.emailToken, config.EMAIL_SECRET)
    console.log('token gets decoded')
    const userId = decoded.id
    console.log('user id is defined')
    await User.findByIdAndUpdate(userId,
      { $set: { isEmailConfirmed: true } },
      { new: true })
    response.redirect('http://localhost:3000/login')
  } catch (error) {
    next(error)
  }
}

export default {
  confirmEmail
}