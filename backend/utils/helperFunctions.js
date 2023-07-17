import config from './config.js'
import nodemailer from 'nodemailer'
import  jwt  from 'jsonwebtoken'

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

export const errorCreator = (message, name) => {
  const error = new Error(message)
  error.name = name
  return error
}

