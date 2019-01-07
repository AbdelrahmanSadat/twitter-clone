const multer = require("multer");
const path = require("path");

// TODO: modify the options?

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

module.exports = upload
