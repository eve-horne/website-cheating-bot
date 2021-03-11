// Declaring dependencies
var express = require('express');
var cors = require('cors');
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');

var spawn = require('child_process').spawn;

// More dependency setup
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 8030);
app.use(cors());

// The app.post endpoint that the data from the frontend is sent to
app.post('/post-loopback', function(req, res) {
	var qParams = [];
	for (var p in req.body) {
		qParams.push({'name':p, 'value':req.body[p]})
	}
	console.log(req.body.query[0]);
	
	var process = spawn('python', ['scraper.py', req.body.query]);
	
});

// Placeholder app.use function for 404 error
app.use(function(req, res){
	res.status(404);
	res.render('404');
});

// Placeholder app.use function for 500 error
app.use(function(err, req, res, next){
	console.error(err.stack);
	res.type('plain/text');
	res.status(500);
	res.render('500');
});

app.listen(app.get('port'), function(){
	console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
