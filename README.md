# node-coding-question

## Requirement 1

### Running A Test
#### Please run the following command to start a server: 
(You need to set the parameters according to database environment. PGUSER--database username, PGDATABASE--database name, PGPASSWORD--databaase password)<br /><br />
npm install <br />
PGUSER='postgres' \\\
PGDATABASE='postgres'\\
PGPASSWORD='zxcvbn' \\
nodemon app.js
#### Please open the link http://localhost:3000/ in browser to start a client 


### File Structure
**--app.js**   //main entry<br />
**--public** //storing static files, inclusing css and html files<br />
&nbsp;&nbsp;--css<br />
&nbsp;&nbsp;&nbsp;&nbsp;--login.css //login page settings<br />
&nbsp;&nbsp;&nbsp;&nbsp;--signup.css<br />
&nbsp;&nbsp;&nbsp;&nbsp;--upload.css<br />
&nbsp;&nbsp;--html<br />
&nbsp;&nbsp;&nbsp;&nbsp;--login.html<br />
&nbsp;&nbsp;&nbsp;&nbsp;--signup.html<br />
&nbsp;&nbsp;&nbsp;&nbsp;--upload.html<br />
**--routes**  //request handler<br />
&nbsp;&nbsp;--login.js   //backend algorithms<br />
&nbsp;&nbsp;--signup.js<br />
&nbsp;&nbsp;--upload.js<br />
**--uploads** //storing uploaded images; storing filenames in the database


## Key Points
1. Store secret key in .env. Keep its status in cookies.
2. Supported actions for users are sign-in, sign-up, sign-out and uploading data.

## Results
![Alt text](images/login.jpg?raw=true "Title")
