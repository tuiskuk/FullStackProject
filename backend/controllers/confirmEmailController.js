import jwt from 'jsonwebtoken';
import config from '../utils/config.js';
import { User } from '../models/user.js';

const confirmEmail = async (request, response) => {

    try {
        const decoded = jwt.verify(request.params.emailToken, config.EMAIL_SECRET);
        const userId = decoded.id;
        await User.findByIdAndUpdate(userId,
            { $set: { isEmailConfirmed: true } },
            { new: true })
    } catch (error) {
      // Handle the error
      response.status(500).json({ error: 'Something went wrong' })
    }
    response.redirect('http://localhost:3000/login')
  }

  export default {
    confirmEmail
  };