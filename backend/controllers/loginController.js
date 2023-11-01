import { User } from '../models/user.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import config from '../utils/config.js'

const login = async (request, response) => {
  try {
    const { email, password } = request.body

    const user = await User.findOne({ email })
    const passwordCorrect =
      user === null ? false : await bcrypt.compare(password, user.passwordHash)

    if (!(user && passwordCorrect)) {
      return response.status(401).json({ error: 'invalid email or password' })
    } else if(!user.isEmailConfirmed){
      return response.status(401).json({
        error: 'email is not confirmed',
      })
    }

    const userForToken = {
      username: user.username,
      id: user._id
    }

    const accessToken = jwt.sign(
      userForToken,
      config.SECRET,
      { expiresIn:  60 * 60 }
    )

    const refreshToken = jwt.sign(
      { id: user._id  },
      config.REFRESH_TOKEN_SECRET,
      { expiresIn: 60 * 60 }
    )

    response.cookie('token', refreshToken, {
      httpOnly: true, // The cookie should be inaccessible to Javascript as possible, to reduce the chance of XSS.
      secure: true, // The cookie should be retrieved only over SSL or HTTPS.
      maxAge:  60 * 60 * 1000, // The Refresh Token has the same life than the Access Token. Convert seconds to ms.
      sameSite: 'None' // The cookie is cross-site
    })

    console.log({ accessToken, user })

    response.status(200).json({ accessToken, user })
  } catch (error) {
    // Handle any potential errors
    console.error('Login error:', error)
    response.status(500).json({ error: 'An error occurred during login' })
  }
}

const getRefreshToken = async (request, response) => {

  // Use the longer-lived Refresh Token stored safely in a secure, httpOnly cookie
  // to grant the user a new short-lived Access Token to use to communicate with the API.

  // If no Refresh Token is found, require a new log in from the user.
  if (!request.cookies?.token)
    return response.status(401).json({ message: 'Unauthorized: please log in again' })

  const refreshToken = request.cookies.token

  console.log(refreshToken)

  // Verify the validity of the Refresh Token, if there is one

  jwt.verify(
    refreshToken,
    config.REFRESH_TOKEN_SECRET,
    async(err, decoded) => {

      // If the Refresh Token is not valid, exit and require a new log in.
      if (err)
        return response.status(403).json({ message: 'Forbidden: please log in again' })

      // Find the user the Refresh Token was assigned to.
      const user = await User.findById(decoded.id)

      // If the user is not found, exit and require a new log in.
      if (!user)
        return response.status(401).json({ message: 'Unauthorized: please log in again' })

      // Otherwise, if all is as it should be, grant the user a new short-lived
      // Access Token.
      const userForToken = {
        username: user.username,
        id: user._id
      }
      const accessToken = jwt.sign(
        userForToken,
        process.env.SECRET,
        { expiresIn:  60 * 60 }
      )

      const refreshToken = jwt.sign(
        { id: user._id  },
        config.REFRESH_TOKEN_SECRET,
        { expiresIn: 60 * 60 }
      )

      response.cookie('token', refreshToken, {
        httpOnly: true, // The cookie should be inaccessible to Javascript as possible, to reduce the chance of XSS.
        secure: true, // The cookie should be retrieved only over SSL or HTTPS.
        maxAge:  60 * 60 * 1000, // The Refresh Token has the same life than the Access Token. Convert seconds to ms.
        sameSite: 'None' // The cookie is cross-site
      })

      response.send({ accessToken })
    }
  )
}

const logout = async (req, res) => {
  if (!req.cookies?.token)
    return res.sendStatus(204) // The httpOnly Refresh Token doesnt exist, so the user is already "logged out".
  // Clear the httpOnly Refresh Token, so the user is requied to sign in the next time they use the client.

  res.clearCookie('token', {
    httpOnly: true,
    secure: true,
    sameSite: 'None'
  })



  res.status(200).send({ message: 'User logged out' })
}

export default {
  login, logout, getRefreshToken
}
