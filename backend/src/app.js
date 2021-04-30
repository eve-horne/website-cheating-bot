// Declaring dependencies
var express = require('express');
var cors = require('cors');
var app = express();
var https = require("https")
var http = require("http")
var bodyParser = require('body-parser');
var spawn = require('child_process').spawn;
var fs = require('fs');
const uuidv4 = require("uuid")
var nodemailer = require("nodemailer")


var options = {
    key: fs.readFileSync('/etc/letsencrypt/live/hax.services/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/hax.services/fullchain.pem')
}

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://dev:PLACEHOLDERASKFORPASSWORD@websitebotdetector.xvumv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

let transporter = nodemailer.createTransport({
	service: 'gmail',
	auth:{
		user: 'websitecheatingbot@gmail.com',
		pass: 'PLACEHOLDERASKFORPASSWORD'
	}
  });
  
 
// More dependency setup
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('port', 8030);
app.use(cors());

// The app.post endpoint that the data from the frontend is sent to
app.post('/getQuery', async function (req, res) {
	
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
	try {
		await client.connect();
		const database = client.db('queryData');
		const results = database.collection('results');
		const queryObj = results.findOne({id: req.body.id}, async function (err, result){
			if (err) throw err;
			console.log(result)
			await client.close();
			res.send(result)
		});
		
		

	} finally {
		// Ensures that the client will close when you finish/error
	}
});
app.post('/', async function (req, res) {
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

	// Getting the data sent in the network request
	var email = req.body.email;
	queryObj = {
		id: uuidv4.v4(),
		status: "Processing",
		class: req.body.courseID,
		query: req.body.query,
		results: []
	};
	
	try {
		await client.connect();
		const database = client.db('queryData');
		const results = database.collection('results');
		
		results.insertOne(queryObj, async function (err, res) {
			if (err) throw err;
			console.log("Inserted entry sucessfully!");
			await client.close();
			scrape(queryObj);
		});

	} finally {
		// Ensures that the client will close when you finish/error
		res.send(queryObj.id);
	}
	sendEmail(email, queryObj.id)
});


async function sendEmail(email, token) {
	var mailoptions = {
		from: '"No Reply " <websitecheatingbot@gmail.com>', // sender address
		to: email, // list of receivers
		subject: "Your query token", // Subject line
		text: "You recently started a query, below is your token: \n \n " + token + "\n\n https://hax.services/dashboard.html", // plain text body
		html: "", // html body
	  }
	  transporter.sendMail(mailoptions, function(err, info){
		if (err) throw err;
		console.log("email sent");
	})
}

// Listening on the port

https.createServer(options,app).listen(8030);
console.log("started")





async function scrape(queryObj) {
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
	const filter = {id: queryObj.id}
	for (var p in queryObj.query) {

		// Spawning a child process for each question
		var process = spawn('python3', ["./scraper.py", queryObj.query[p][0]]);
		process.stdout.on('data', async function (data) {

			// If an actual URL is returned from the scraper
			if ((data.toString()).length > 5) {
				try {
					await client.connect();
					const database = client.db('queryData');
					const results = database.collection('results');
					const updateDoc = {
						$push: {
							results: eval(data.toString())
						},
					  };
					results.updateOne(filter,updateDoc, {upsert: false}, async function (err, res) {
						if (err) throw err;
						console.log("updated entry sucessfully!");
						await client.close();
					});
			
				} finally {
					// Ensures that the client will close when you finish/error
				
				}
				// Printing the URL

			}
		})
	}
	markDone(queryObj.id);
}
async function markDone(objid) {
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
	const filter = {id: objid}
	try {
		await client.connect();
		const database = client.db('queryData');
		const results = database.collection('results');
		const updateDoc = {
			$set: {
				status: "Completed"
			},
		  };
		results.updateOne(filter,updateDoc, {upsert: false}, async function (err, res) {
			if (err) throw err;
			console.log("updated entry sucessfully!");
			await client.close();
		});

	} finally {
		// Ensures that the client will close when you finish/error
	
	}
}
