/*
To run, need to download MongoDB and run the following commands:
npm install mongodb
npm install express
npm install body-parser
*/

// Setting the variables
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/CapstoneDB";

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var app = express();

// app.use triggers every time it is used
app.use(bodyParser.urlencoded({ extended: true }));

// app.post triggers when there is a post request
app.post('/', (req, res) => {
	// Setting the data
	var data = {
		coursecode: req.body.coursecode,
		questions: req.body.questions,
		answers: req.body.answers
	};
	// Connecting to the MongoDB database
	MongoClient.connect(url, (err, db) => {
		// Inserting the data into the CourseData collection
		db.collection('CourseData').insertOne(data, (err, res) => {
			if (err) throw err;
			console.log("Data inserted");
			db.close();
		});
	});
});
