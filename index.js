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
var overviewRouter = require('./routes/overview.route');
var electRouter = require('./routes/elect.route');
//-------------------------------------------------------------------

var mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useFindAndModify: false});


app.get('/', function(req, res) {
	res.render('dashboard/list');
}) 

// Router -----------------------------------------------------------
app.use('/users', userRouter);
app.use('/auth', authRouter);
app.use('/station', stationRouter);
app.use('/overview', overviewRouter);
app.use('/elect', electRouter);

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
   console.log('Mosca client connected ', client.id);
});
server.on('ready', function(){
	console.log("Server Mosca MQTT ready for PLC " + settings.port + ", for web port " + settings.http.port);
});

var Datatest = require('./models/elect.model')

//find when a message .is received
server.on('published',function getdata(packet,client) {
	
	if(packet.topic =='Data/MSB_01') 
	{
		// console.log('data: ', packet.topic);
		var data = packet.payload.toString();
		var jsondata = JSON.parse(data);
		io.emit('data', jsondata);
		var now = new Date();

		var saveData = { 	"name" : "MSB01",
							"value" : jsondata,
							"timestamp" : now
						}
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

	
});

//-------------------------------------------------------------------

http.listen(3001, function(){
  console.log('Socket IO: listening on *:3001');
});


io.on('connection', function(socket){
  console.log('Socket IO: a user connected');
  io.emit('data', "hihi");
});

