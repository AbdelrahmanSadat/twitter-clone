const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
      user: process.env.EMAIL_ID,
      pass: process.env.EMAIL_PASSWORD
  }
})

module.exports = transporter
