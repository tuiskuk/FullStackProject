import { User } from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const login = async (request, response) => {
  try {
    const { email, password } = request.body;

    const user = await User.findOne({ email });
    const passwordCorrect =
      user === null ? false : await bcrypt.compare(password, user.passwordHash);

    if (!(user && passwordCorrect)) {
      return response.status(401).json({
        error: "invalid username or password",
      });
    }

    const userForToken = {
      username: user.email,
      id: user._id,
    };

    const token = jwt.sign(userForToken, process.env.SECRET, {
      expiresIn: 60 * 60,
    });

    console.log({ token, user });

    response.status(200).send({ token, user });
  } catch (error) {
    // Handle any potential errors
    console.error('Login error:', error);
    response.status(500).json({ error: 'An error occurred during login' });
  }
};

export default {
  login,
};
