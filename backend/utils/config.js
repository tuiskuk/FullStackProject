import dotenv from 'dotenv'
dotenv.config()

const PORT = process.env.PORT
const EDAMAM_ID = process.env.EDAMAM_ID
const EDAMAM_APPLICATION_KEY = process.env.EDAMAM_APPLICATION_KEY

export default {
  PORT,
  EDAMAM_ID,
  EDAMAM_APPLICATION_KEY
}