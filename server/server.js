

const express = require('express'); //load the express library into the file
const mysql = require('mysql');
const mysqlcredentials = require('./mysqlcreds.js');

const db = mysql.createConnection( mysqlcredentials )

const server = express(); //you now have a server! express is running node

server.use( express.static( __dirname + '/html' ) ); //middleware //looks in the html folder for a file called index.html, and grabs that file and serves it

//ex: in the url, I can add /components/students.js to read that file on the browser

server.get( '/api/grades', ( req, res ) => {
  res.send(`{
  	"success": true,
  	"data": [{
  		"id": 10,
  		"name": "Johnny",
  		"course": "math",
  		"grade": 66
  	}, {
  		"id": 12,
  		"name": "Bob",
  		"course": "science",
  		"grade": 83
  	}, {
  		"id": 14,
  		"name": "John",
  		"course": "english",
  		"grade": 98
  	}]
  }`)
}) //the api name doesn't matter - it can be named anything

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
