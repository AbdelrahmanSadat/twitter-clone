const nodemailer = require("nodemailer");
const multer = require("multer");
const path = require("path");
// TODO: refactor

// mutler setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/images/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
  }
})
const upload = multer({ dest: './uploads/images/',
  storage:storage,
  fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            return callback(new Error('Only images are allowed'))
        }
        callback(null, true)
    },
  limits:{
        fileSize: 1024 * 1024 * 10  //10MB
    }
});

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
  }),

  upload: upload
}
