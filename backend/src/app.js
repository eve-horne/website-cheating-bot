// Declaring dependencies
var express = require('express');
var cors = require('cors');
var app = express();
var bodyParser = require('body-parser');
var spawn = require('child_process').spawn;
var fs = require('fs');

// More dependency setup
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('port', 8030);
app.use(cors());

// The app.post endpoint that the data from the frontend is sent to
app.post('/', function(req, res) {
	
	// Getting the number of questions
	var numQuestions = 0;
	for (var i in req.body.query) {
		numQuestions++;
	}
	console.log(req.body);
	// Getting the data sent in the network request
	for (var p in req.body.query) {
		
		// Spawning a child process for each question
		var process = spawn('python', ["./scraper.py", req.body.query[p][0]]);
		process.stdout.on('data', function(data) {
			
			// If an actual URL is returned from the scraper
			if ((data.toString()).length > 5) {
				fs.writeFile('URLresults.txt', data.toString(), { flag: 'a' }, err => {});
				// Printing the URL
				console.log(data.toString());
			}
		})
	}
});

// Listening on the port
app.listen(app.get('port'), function(){
	console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
