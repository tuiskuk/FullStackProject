import dotenv from 'dotenv'
dotenv.config()

const PORT = process.env.PORT
const EDAMAM_ID = process.env.EDAMAM_ID
const EDAMAM_APPLICATION_KEY = process.env.EDAMAM_APPLICATION_KEY
const MONGODB_URI = process.env.MONGODB_URI
const EMAIL_SECRET = process.env.EMAIL_SECRET
const MY_GMAIL_PASSWORD = process.env.MY_GMAIL_PASSWORD
const MY_GMAIL = process.env.MY_GMAIL
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET
const SECRET = process.env.SECRET

export default {
  SECRET,
  REFRESH_TOKEN_SECRET,
  PORT,
  EDAMAM_ID,
  EDAMAM_APPLICATION_KEY,
  MONGODB_URI,
  EMAIL_SECRET,
  MY_GMAIL_PASSWORD,
  MY_GMAIL,
}