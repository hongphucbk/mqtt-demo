require('dotenv').config();

const express = require('express')
const app = express()
const port = 3000

var bodyParser = require('body-parser')

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded


var engine = require('ejs-locals');
app.engine('ejs', engine);
app.set('view engine', 'ejs');

app.use(express.static('public'));
app.set('views', './views');

//app.use(express.static(path.join(__dirname, 'public')));

// Khai báo Router --------------------------------------------------
var userRouter = require('./routes/user.route');
var stationRouter = require('./routes/station.route');
var overviewRouter = require('./routes/overview.route');
var electRouter = require('./routes/elect.route');
//-------------------------------------------------------------------

var mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useFindAndModify: false});


app.get('/', function(req, res) {
	res.render('layout/index');
}) 

// Router -----------------------------------------------------------
app.use('/users', userRouter);
app.use('/station', stationRouter);
app.use('/overview', overviewRouter);
app.use('/elect', electRouter);

//-------------------------------------------------------------------

app.listen(port, function(){
	console.log(`Server listening on port ${port}!`)
});

// Add server MQTT
var mosca = require('mosca');
var settings = {
		port:1883
	}

var server = new mosca.Server(settings);
server.on('clientConnected', function(client) {
   //console.log('client connected', client.id);
});
server.on('ready', function(){
	console.log("Server Mosca MQTT ready");
});


var Datatest = require('./models/datatest.model')

//find when a message .is received
server.on('published',function getdata(packet,client) {
	if(packet.topic =='topic1/demo') 
	{
		// console.log('data: ', packet.topic);
		var data = packet.payload.toString();
		var jsondata = JSON.parse(data);

		var saveData = { "val" : jsondata }
				console.log('receive: ', saveData);

		Datatest.insertMany(saveData, function(err) {
			if (err) return handleError(err);
		});

	}
});
