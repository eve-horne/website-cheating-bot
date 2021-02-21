var express = require('express');
var cors = require('cors');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 8030);

app.use(cors());

app.get('/', function(req, res) {
	res.render('home');
});

app.get('/show-data', function(req, res) {
	var context = {};
	context.sentData = req.query.myData;
	res.render('show-data', context);
});

app.post('/post-loopback', function(req, res) {
	var qParams = [];
	for (var p in req.body) {
		qParams.push({'name':p, 'value':req.body[p]})
	}
	console.log(qParams);
	console.log(req.body);
	var context = {};
	context.dataList = qParams;
	res.render('post-loopback', context);
});

app.use(function(req, res){
	res.status(404);
	res.render('404');
});

app.use(function(err, req, res, next){
	console.error(err.stack);
	res.type('plain/text');
	res.status(500);
	res.render('500');
});

app.listen(app.get('port'), function(){
	console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});