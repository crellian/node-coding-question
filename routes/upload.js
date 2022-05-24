const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

//Postgres Database
const { Pool } = require('pg')
const pool = new Pool()

//fetch secret key
const dotenv = require('dotenv');
dotenv.config({path: path.resolve(__dirname, '..', '.env')});

//define a function for authentication
const jwt = require('jsonwebtoken');
function authenticateToken(req, res, next) {
  const token = req.cookies["token"]

  if (token == null) return res.redirect('/login');

  jwt.verify(token, ''+process.env.TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403)

      req.user = user

      next()
  })
}

//parser
const multer = require('multer');
const upload = multer({ dest: 'uploads/'}); //store uploaded images on the disk and their paths in the DB

// for parsing multipart/form-data
var type = upload.single('img');

//show upload page
router.get('/', authenticateToken, function(req, res){
   res.sendFile(path.join(__dirname, '../public/html/upload.html'));
});

//received user's upload files
router.post('/', type, function (req,res) {
  var title = req.body.title
  var desc = req.body.desc
  var filename = req.file.originalname; //file's original name
  var tempPath = req.file.path //full path of the file on the remote disk
  var targetPath = 'uploads/' + filename
  fs.rename(tempPath, targetPath, err => {
      if (err) {
         res.send("File System Error!")
      } else {
         //insert image data into the table
         const query = {
             text: 'UPDATE user_info SET title=$1, description=$2, filename=$3 WHERE email=$4',
             values: [title, desc, filename, 'cliu2660@usc.edu'],
         }

         pool.query(query, (err) => {
             if (err) {
                 res.send("Database Error!")
             } else {
                 res.send("You've successfully uploaded!");
             }
         })
      }
  });
});

module.exports = router;
