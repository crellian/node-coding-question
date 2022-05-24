const express = require('express');
const router = express.Router();
const path = require('path');

//Postgres Database
const { Pool } = require('pg')
const pool = new Pool()

//fetch secret key
const dotenv = require('dotenv');
dotenv.config({path: path.resolve(__dirname, '..', '.env')});

//define a function for key generation
const jwt = require('jsonwebtoken');
function generateAccessToken(username) {
  return jwt.sign(username, process.env.TOKEN_SECRET);
}

//show login page
router.get('/', function(req, res){
   res.sendFile(path.join(__dirname, '../public/html/login.html'));
});

//received user's login information
router.post('/', function(req, res){
   var userInfo = req.body; //Get the parsed information
   var email = req.body.email;
   var password = req.body.password;

   //retrieve user's record
   const query = {
      text: 'SELECT * FROM user_info WHERE email = $1 AND password = $2',
      values: [email, password],
   }

   pool.query(query, (err, res_) => {
      if (err) {
         res.send("Database Error!")
      } else {
         if(res_.rowCount){
             const token = generateAccessToken({ username: email });
             res.cookie('token', token);
             res.redirect('/upload');
         } else {
             res.send("We couldn’t sign you in to your account. Check to make sure your email and password are correct.")
         }
      }
   })

});

module.exports = router;
