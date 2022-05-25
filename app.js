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
const createUserTable = 'CREATE TABLE IF NOT EXISTS user_info(id SERIAL PRIMARY KEY, name VARCHAR (50) NOT NULL, email VARCHAR (50) UNIQUE NOT NULL, password TEXT NOT NULL)'

const createGalleryTable = 'CREATE TABLE IF NOT EXISTS gallery(email VARCHAR (50) NOT NULL, title VARCHAR (50),  filename TEXT, description TEXT, date CHAR (24), PRIMARY KEY(email, title))'

pool.query(createUserTable, (err, res) => {
  if (err) {
    console.log(err.stack)
  }
  else{
      pool.query(createGalleryTable, (err, res) => {
        if (err) {
          console.log(err.stack)
        }
      })
  }
})

//clear uploads directory
const directory = 'uploads';

fs.readdir(directory, (err, files) => {
  if (err) throw err;

  for (const file of files) {
    fs.unlink(path.join(directory, file), err => {
      if (err) throw err;
    });
  }
});

//create secret key
const secret = require('crypto').randomBytes(64).toString('hex')
  fs.writeFile('.env', 'TOKEN_SECRET=' + secret,  function(err) {
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

app.use('/signout', function(req, res){
    res.clearCookie('foo');
    res.send("You're Signed Out.");
});

//start server
var server = app.listen(PORT, function(){
  console.log('Listening on port ' + server.address().port);
});
