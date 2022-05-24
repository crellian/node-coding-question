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

//show signup page
router.get('/', function(req, res){
   res.sendFile(path.join(__dirname, '../public/html/signup.html'));
});

//received user's signup information
router.post('/', function(req, res){
    var userInfo = req.body; //Get the parsed information
    var email = req.body.email;
    var name = req.body.name;
    var password = req.body.password;
    
    //insert records into the table
    const query = {
       text: 'INSERT INTO user_info(name, email, password) VALUES($1, $2, $3)',
       values: [name, email, password],
    }

    pool.query(query, (err) => {
       if (err) {
          res.send("Database Error!")
       } else {
          const token = generateAccessToken({ username: email });
          res.cookie('token', token);
          res.redirect('/upload');
       }
    })
});

module.exports = router;
