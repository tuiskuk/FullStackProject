import config from './config.js'
import nodemailer from 'nodemailer'
import  jwt  from 'jsonwebtoken'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import fs from 'fs'

//sends confirm email mail to given email
export const sendUserConfirmationEmail = (email, user) => {

  const emailToken = jwt.sign( { id: user._id,
  } , config.EMAIL_SECRET , { expiresIn: '1d' } )

  const url = `http://localhost:3001/api/register/${emailToken}`
  console.log(url)
  console.log(config.MY_GMAIL)
  console.log(config.MY_GMAIL_PASSWORD)
  console.log(email)


  const transporter = nodemailer.createTransport({
    host: 'smtp.elasticemail.com',
    port: 2525,
    auth: {
      user: `${config.MY_GMAIL}`,
      pass: `${config.MY_GMAIL_PASSWORD}`
    }
  })


  const mailOptions = {
    from: `${config.MY_GMAIL}`,
    to: `${email}`,
    subject: 'Confirmation of your foodapp user',
    html: `<p>Please click on the following link to confirm your FoodApp account:</p><a href="${url}">Confirm your foodapp account</a>`
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error:', error)
    } else {
      console.log('Email sent:', info.response)
    }
  })
}

//throws error
export const errorCreator = (message, name) => {
  const error = new Error(message)
  error.name = name
  return error
}

//deletes picture from user.profileImage
export const imageDeleter = (user) => {
  /*little manipulation to avoid harcoded path to images folder
  in order to make it possible for everybody to use this*/
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = dirname(__filename)

  const oldProfilePicturePathEnd = '../' + user.profileImage.replace('http://localhost:3001/', '')
  const oldProfilePicturePath = resolve(__dirname, oldProfilePicturePathEnd)

  if(fs.existsSync(oldProfilePicturePath)) {
    fs.unlink(oldProfilePicturePath, (err) => {
      if (err) {
        console.log('error deleting picture')
      }
    })
  }
  console.log('old profile picture deleted')
}

export const recipePictureDeleter = (images) => {
  /*little manipulation to avoid harcoded path to images folder
  in order to make it possible for everybody to use this*/
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = dirname(__filename)

  //array of recipes to be deleted
  const recipePicturesToDelete = images
    .map(image => '../' + image.replace('http://localhost:3001/', ''))
    .map(imagePathEnd => resolve(__dirname, imagePathEnd))

  console.log(recipePicturesToDelete)

  let picturesDeletedCount = 0
  recipePicturesToDelete.forEach((recipePicturePath) => {
    if(fs.existsSync(recipePicturePath)) {
      fs.unlink(recipePicturePath, (err) => {
        if (err) {
          console.log('error deleting recipepicture')
        } else {
          picturesDeletedCount++
          if (picturesDeletedCount === recipePicturesToDelete.length) {
            console.log('All recipe pictures deleted')
          }
        }
      })
    }
  })
  console.log('loop for deleting recipe pictures executed')

}



