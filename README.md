## Technologies being used
Node.js
Express.js
JWT
PostgreSQL

## Requirement 1

### Running A Test
#### Please run the following command to start a server: 
(Check if there is a /uploads/ folder under the root, if it is not there please create one.)<br />
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
&nbsp;&nbsp;&nbsp;&nbsp;--gallert.css<br />
&nbsp;&nbsp;--html<br />
&nbsp;&nbsp;&nbsp;&nbsp;--login.html<br />
&nbsp;&nbsp;&nbsp;&nbsp;--signup.html<br />
&nbsp;&nbsp;&nbsp;&nbsp;--upload.html<br />
&nbsp;&nbsp;&nbsp;&nbsp;--gallert.html<br />
**--routes**  //request handler<br />
&nbsp;&nbsp;--login.js   //backend algorithms<br />
&nbsp;&nbsp;--signup.js<br />
&nbsp;&nbsp;--upload.js<br />
&nbsp;&nbsp;--buildHtml.js<br />
**--uploads** //storing uploaded images; storing filenames in the database


## Key Points
1. Enabled sign-out. 
2. Reformatted naming of stored image files to avoid conflication between different users. Sample name format: "username_filename.jpg".
3. Keep two tables in database: one is for user information (email, password, etc.), the other is for uploaded images (email, data, filenames). Files uploaded in one Post are managed together in a single entry of the table. Filenames are concatenated in a string like 'image1;image2;image3'.
5. Supported actions for users are sign-in, sign-up, sign-out and uploading data.
6. Maximum number of images allowed to be submitted is constrained by multer().array('img', 5);
7. When user request to access remotely stored images, the server will send a query to the backend database and obatain several records. Each record represents a Post and includes indices to no more than five images. The 'buildHtml.js' will generate an html file for each Post, and different Post are paginated by links.
8. Users can edit their Posts by upload new data with the same title. The database will perform UPSERT in the backend.

## Results
![Alt text](images/login.png?raw=true "Title")
![Alt text](images/signup.png?raw=true "Title")
![Alt text](images/upload.png?raw=true "Title")
![Alt text](images/gallery.png?raw=true "Title")
