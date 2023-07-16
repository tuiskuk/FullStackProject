import jwt from 'jsonwebtoken'
import config from '../utils/config.js'
import { User } from '../models/user.js'

const confirmEmail = async (request, response) => {
  console.log('inside confirm')
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
    console.log('user updated')
  } catch (error) {
    // Handle the error
    response.status(500).json({ error: 'Something went wrong' })
  }
  response.redirect('http://localhost:3000/login')
}

export default {
  confirmEmail
}