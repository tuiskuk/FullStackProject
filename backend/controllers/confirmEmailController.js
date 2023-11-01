import jwt from 'jsonwebtoken'
import config from '../utils/config.js'
import { User } from '../models/user.js'

const confirmEmail = async (request, response, next) => {

  try {

    const decoded = jwt.verify(request.params.emailToken, config.EMAIL_SECRET)
    const userId = decoded.id
    await User.findByIdAndUpdate(userId,
      { $set: { isEmailConfirmed: true } },
      { new: true })
    response.redirect('https://dishcovery-nimz.onrender.com/login')
  } catch (error) {
    next(error)
  }
}

export default {
  confirmEmail
}