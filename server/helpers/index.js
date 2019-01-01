const nodemailer = require("nodemailer");

module.exports={
  randomCode(){
    return Math.floor(Math.random()*9000)+1000;
  },

  transporter: nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASSWORD
    }
  })
}
