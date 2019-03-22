

const express = require('express'); //load the express library into the file
const mysql = require('mysql');
const mysqlcredentials = require('./mysqlcreds.js');//load the credentials from a local file for mysql
//using the credentials that we loaded, establish a preliminary connection to the database
const db = mysql.createConnection( mysqlcredentials )

const server = express(); //you now have a server! express is running node

server.use( express.static( __dirname + '/html' ) ); //middleware //looks in the html folder for a file called index.html, and grabs that file and serves it
server.use( express.urlencoded( { extended: false } )) //have express pull body data that is urlencoded and place it into an object called body


//ex: in the url, I can add /components/students.js to read that file on the browser

//takes a callback function once the connection (request) is made at port 3001 at the specified location (/api/grades)
//make an enpoint to handle retrieving the grades of all students
server.get( '/api/grades', ( req, res ) => {
  //establish the connection to the database, and call the callback function when connection is made
  db.connect( () => {
    //create a query for our desired operation
    const query = 'SELECT `id`, CONCAT(`givenname`, " ", `surname`) AS `name`, `course`, `grade` FROM `grades`';
    //send the query to the database, and call the given callback function once the data is retreived or an error happens
    db.query( query, ( error, data ) => { //send query to database
      //if error is null, no error occured
      //create an output object to be sent back to the client
      const output = {
        success: false,
      }
      //if error is null, send the data
      if(!error) {
        //notify the client that we were successful
        output.success = true;
        //attach the data from the database in the output object
        output.data = data;
      } else {
        //an error occurred, attach that error onto the output so we can see what happened
        output.error = error
      }
      //send the data back to the client
      res.send( output );
    }); //call the function when sent
  }) //establish the db connection if that address is requested
}) //the api name doesn't matter - it can be named anything

server.post( '/api/grades', ( request, response ) => {

})

server.listen( 3001, () => { //port and callback function
  console.log('server is running on port 3001');
  console.log('carrier has arrived');
});





















// const insults = [
//   'sldjflsda',
//   'insult',
//   'another insult'
// ]
//
//
//       //arguments: the path to listen for
//                 // the callback function to call once that path has been received
// server.get( '/', ( request, response ) => {//endpoint 1: localhost:3001/
//   //an object representing all of the data coming from the client to the server
//   //an object representing all of the data going from the server to the client
//   response.send('Hello, World')
// })
//
// server.get('/time', ( request, response) => { //endpoint 2: localhost:3001/time
//   var now = new Date();
//   response.send( now.toLocaleDateString() )
// })
//
// server.get( '/insult', ( request, response) => {
//   let randomNum = Math.floor(Math.random() * insults.length);
//   response.send( insults[randomNum] );
// })
