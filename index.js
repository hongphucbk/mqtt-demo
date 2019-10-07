require('dotenv').config();
const express = require('express')
const app = express()
const port = 3000

var http = require('http').createServer(app);
var io = require('socket.io')(http);

var bodyParser = require('body-parser')

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

var engine = require('ejs-locals');
app.engine('ejs', engine);
app.set('view engine', 'ejs');

app.use(express.static('public'));
app.set('views', './views');

const excel = require('node-excel-export');
//app.use(express.static(path.join(__dirname, 'public')));

// Khai báo Router --------------------------------------------------
var userRouter = require('./routes/user.route');
var authRouter = require('./routes/auth.route');
var stationRouter = require('./routes/station.route');
var cabinetRouter = require('./routes/cabinet.route');
var overviewRouter = require('./routes/overview.route');
var electRouter = require('./routes/elect.route');

var waterRouter = require('./routes/water.route');
var smarthomeRouter = require('./routes/smarthome.route');

//-------------------------------------------------------------------

var mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useFindAndModify: false});

var Station = require('./models/station.model');
app.get('/', function(req, res) {
	Station.find().then(function(stations){
		res.render('overview/maps', {
			stations: stations
		})
	})
}) 

// Router -----------------------------------------------------------
app.use('/users', userRouter);
app.use('/auth', authRouter);
app.use('/station', stationRouter);
app.use('/cabinet', cabinetRouter);
app.use('/overview', overviewRouter);
app.use('/elect', electRouter);

app.use('/water', waterRouter);
app.use('/smarthome', smarthomeRouter);
//-------------------------------------------------------------------
app.listen(port, function(){
	console.log(`Server listening on port ${port}!`)
});

//-------------------------------------------------------------------
// Add server MQTT
var mosca = require('mosca');
// var settings = {
// 		port:1883
// 	}
var settings = {
	http:{
		port: 3002 	//MQTT for Web
	},
	port:3003,		//MQTT for PLC
	}

var server = new mosca.Server(settings);

server.on('clientConnected', function(client) {
   console.log('MQTT Mosca client connected ', client.id);
   var message = {
	  topic: 'status/sonoff/connect',
	  payload: '1', // or a Buffer
	  qos: 0, // 0, 1, or 2
	  retain: false // or true
	};

	server.publish(message);
});

server.on('clientDisconnected', function(client) {
	console.log('MQTT Client Disconnected:', client.id);
	var message = {
	  topic: 'status/sonoff/connect',
	  payload: '0', // or a Buffer
	  qos: 0, // 0, 1, or 2
	  retain: false // or true
	};

	server.publish(message);

});


server.on('ready', function(){
	console.log("Server Mosca MQTT ready for PLC " + settings.port + ", for web port " + settings.http.port);
});

var Data = require('./models/elect.model')
var Water = require('./models/water.model')

let arrCabinet = ["MSB1", "MSB2","SB_B2"]
//find when a message .is received
server.on('published',function getdata(packet,client) {
	if(packet.topic =='Data/MSB_01') 
	{
		// console.log('data: ', packet.topic);
		var data = packet.payload.toString();
		var jsondata = JSON.parse(data);
		// io.emit('data', jsondata);
		var now = new Date();

		var saveData = { 	"station" : jsondata.Area,
							"name" : "MSB01",
							"value" : jsondata,
							"timestamp" : now
						}
		Data.insertMany(saveData, function(err) {
			if (err) return handleError(err);
		});
		console.log('receive: ', saveData);
	}

	if(packet.topic =='Data/MSB_02') 
	{
		// console.log('data: ', packet.topic);
		var data = packet.payload.toString();
		var jsondata = JSON.parse(data);
		io.emit('data', jsondata);
		var now = new Date();
		var saveData = { 	"station" : jsondata.Area,
							"name" : "MSB02",
							"value" : jsondata,
							"timestamp" : now
						}
		Data.insertMany(saveData, function(err) {
			if (err) return handleError(err);
		});
		console.log('receive: ', saveData);
	}

	if(packet.topic =='Data/SB_B2') 
	{
		// console.log('data: ', packet.topic);
		var data = packet.payload.toString();
		var jsondata = JSON.parse(data);
		io.emit('data', jsondata);
		var now = new Date();
		var saveData = { 	"station" : jsondata.Area,
							"name" : "SB_B2",
							"value" : jsondata,
							"timestamp" : now
						}
		Data.insertMany(saveData, function(err) {
			if (err) return handleError(err);
		});
		console.log('receive: ', saveData);
	}

	if(packet.topic =='topic1/write') 
	{
		// console.log('data: ', packet.topic);
		var data = packet.payload.toString();
		console.log("Đèn phòng khách đang: " + data)
	}

	if(packet.topic =='mqtt/write') 
	{
		//onsole.log('data: ', packet.topic);
		var data = packet.payload.toString();
		console.log("MQTT WRITE: " + data)
	}

	if(packet.topic =='topic1/test') 
	{
		// console.log('data: ', packet.topic);
		var data = packet.payload.toString();
		console.log("Đèn phòng khách đang: " + data)
	}

	//SON OFF
	if(packet.topic =='stat/sonoff/POWER') 
	{

		//console.log('data: ', packet.topic);
		let data = packet.payload.toString();
		console.log("Data nhận được: " + data)
	}

	if(packet.topic =='stat/sonoff/RESULT') 
	{
		//console.log('data: ', packet.topic);
		//var data1 = packet.payload.toString();
		//console.log("Result: " + data1)
		var message = {
		  topic: 'status/sonoff/connect',
		  payload: '1', // or a Buffer
		  qos: 0, // 0, 1, or 2
		  retain: false // or true
		};

		server.publish(message);
		
	}



	if(packet.topic =='PLC/Data') 
	{
		// console.log('data: ', packet.topic);
		console.log("Data Goc: " + typeof(packet.payload))
		var data = packet.payload.toString();
		console.log("Data Type nhan duoc la: " + typeof(data))
		console.log("Data nhan duoc la: " + JSON.parse(data))
		var data_json = JSON.parse(data)
		console.log("Data nhan duoc la: " + data_json.TEST1 )
		io.emit('data', data_json.TEST1);
	}

	if(packet.topic =='Water/Level') 
	{
		// console.log('data: ', packet.topic);
		let data = packet.payload.toString();
		//console.log("Dữ liệu nhận được: " + data)
		let data_json = JSON.parse(data)
		console.log("Data nhan duoc la: " + data_json )

		let now = new Date();
		let saveData = { 	"station" : data_json.Area,
							"name" : "1",
							"data" : parseFloat(data_json.Level0.toFixed(2)),
							"timestamp" : now
						}

		Water.insertMany(saveData, function(err) {
			if (err) return handleError(err);
		});

		saveData = { 	"station" : data_json.Area,
							"name" : "2",
							"data" : parseFloat(data_json.Level1.toFixed(2)),
							"timestamp" : now
						}
		Water.insertMany(saveData, function(err) {
			if (err) return handleError(err);
		});
		console.log('receive: ', saveData);
		io.emit('level1', data_json.Level0.toFixed(2));
		io.emit('level2', data_json.Level1.toFixed(2));
	}

	
});

//-------------------------------------------------------------------

http.listen(3001, function(){
  console.log('Socket IO: listening on *:3001');
});


io.on('connection', function(socket){
  console.log('Socket IO: a user connected');
  //io.emit('data', "hihi");
});

