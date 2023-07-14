import jwt from 'jsonwebtoken'
import { User } from '../models/user.js'

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const requireAuthentication = async (req, res, next) => {
  /*
  Middleware used for authenticating an user.

  Checks that the request to the protected route contains a valid
  JsonWebToken in the Authorization-header. The token is then decoded
  and used to authenticate the user who made the request.
*/

  console.log(req)
  const authorization = req.get('authorization') || req.get('Authorization')

  // If the token is missing or invalid, deny the request with 401 Unauthorized.
  if (!(authorization && authorization.toLowerCase().startsWith('bearer ')))
    return res.status(401).json({ message: 'Authorization required: missing token.' })

  const token = authorization.substring(7)
  const decodedToken = jwt.verify(token, process.env.SECRET) // jwt.verify throws an JsonWebTokenError if the token is not valid.

  // The authenticated user is added to the request.
  const user = await User.findById(decodedToken.userId)
  req.user = user

  next()
}

export default {
  requestLogger, unknownEndpoint, requireAuthentication
}