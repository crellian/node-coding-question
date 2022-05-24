const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

const login = require("./routes/login");
const signup = require("./routes/signup");
const upload = require("./routes/upload");

const PORT = process.env.PORT || 3000

//cookie
const cookieParser = require('cookie-parser');
app.use(cookieParser());

//Postgres Database
const { Pool } = require('pg')
const pool = new Pool()

//Create a new table if we haven't created it yet
const createTable = 'CREATE TABLE IF NOT EXISTS user_info(id SERIAL PRIMARY KEY, name VARCHAR (50) NOT NULL, email TEXT UNIQUE NOT NULL, password TEXT NOT NULL, filename TEXT, title TEXT, description TEXT)'

pool.query(createTable, (err, res) => {
  if (err) {
    console.log(err.stack)
  }
})

//create secret key
const secret = require('crypto').randomBytes(64).toString('hex')
  fs.writeFile('key.env', 'TOKEN_SECRET=' + secret,  function(err) {
     if (err) {
       return console.error(err);
     }
});

//path for static files
app.use(express.static(__dirname + '/public'));

//parser
const bodyParser = require('body-parser');
const multer = require('multer');
// for parsing application/json
app.use(bodyParser.json());
// for parsing application/xwww-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//redirect to login page
app.get('/', function(req, res){
   res.redirect('/login');
});

app.use('/login', login);

app.use('/signup', signup);

app.use('/upload', upload);

//start server
var server = app.listen(PORT, function(){
  console.log('Listening on port ' + server.address().port);
});
