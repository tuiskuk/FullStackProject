import jwt from 'jsonwebtoken'
import { User } from '../models/user.js'

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}


const errorHandler = (error, request, response, next) => {
  console.log(error.message)
  console.log('error function entered')

  if(request.isUnknownEndpoint){
    return response.status(404).json({ error: 'Unknown endpoint' })
  } else if (error.name === 'CastError') {
    console.log('malformatted id')
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    console.log('ValidationError')
    const validationError = error.errors ? Object.values(error.errors)[0].message : error.message
    return response.status(400).json({ error: validationError })
  } else if (error.code === 11000) {
    console.log('DublicateUniqueFieldError') // Duplicate value error (e.g., duplicate username or email)
    const duplicateField = Object.keys(error.keyPattern)[0]
    return response.status(400).json({ error: `${duplicateField} already exists` })
  } else if (error.name ===  'JsonWebTokenError') {
    console.log('JsonWebTokenError')
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'TokenExpiredError') {
    console.log('TokenExpiredError')
    return response.status(401).json({ error: 'token expired' })
  } else {
    console.log('unknownError')
    return response.status(500).json({ error: 'Something went wrong' })
  }
  next(error)
}

const requireAuthentication = async (req, res, next) => {
  /*
  Middleware used for authenticating an user.

  Checks that the request to the protected route contains a valid
  JsonWebToken in the Authorization-header. The token is then decoded
  and used to authenticate the user who made the request.*/


  const authorization = req.get('authorization') || req.get('Authorization')

  console.log(authorization)

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


const unknownEndpoint = (request, response, next) => {
  request.isUnknownEndpoint = true
  next()
}



export default {
  requestLogger, errorHandler , unknownEndpoint, requireAuthentication
}