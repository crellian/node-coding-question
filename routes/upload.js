const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const buildHtml= require('./buildHtml')

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

      res.cookie('user', user);

      next()
  })
}

//parser
const multer = require('multer');
const upload = multer({ dest: 'uploads/'}); //store uploaded images on the disk and their paths in the DB

// for parsing multipart/form-data
var type = upload.array('img', 5);

//show upload page
router.get('/', authenticateToken, function(req, res){
   res.sendFile(path.join(__dirname, '../public/html/upload.html'));
});

//received user's upload files
router.post('/', type, function (req,res) {
  var time = new Date().toISOString();
  var title = req.body.title
  var desc = req.body.desc
  var filenameArr = '';
  for(var file of req.files) {
      var filename = file.originalname; //file's original name
      
      var tempPath = file.path; //full path of the file on the remote disk
      var targetPath = 'uploads/' + req.cookies["user"]["username"] + '_'+ filename;
      
      filenameArr = filename +';'+ filenameArr;
      fs.rename(tempPath, targetPath, err => {
          if (err) {
             res.send("File System Error!");
              return;
          }
      });
    }
    //insert data into the table
    const query = {
        text: 'INSERT INTO gallery(email, title, description, filename, date) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (email, title) DO UPDATE SET description=$3, filename=$4, date=$5',
        values: [req.cookies["user"]["username"], title, desc, filenameArr, time],
    }
    pool.query(query, (err, res_) => {
        if(res_.rowCount){
            const querySearch = {text: 'SELECT * FROM gallery WHERE email = $1', values: [req.cookies["user"]["username"]]};
            pool.query(querySearch, (err, res_) => {
                if(res_.rowCount){
                    buildHtml(res_.rows, res);
                } else {
                    res.send("We didn't find your data.")
                }
            })
        } else {
            res.send("Database Error!")
        }
    })

});

module.exports = router;
