export default function () {
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

		if(packet.topic =='stat/sonoff/POWER') 
		{
			// console.log('data: ', packet.topic);
			var data = packet.payload.toString();
			console.log("Đèn phòng khách đang: " + data)
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

		
	});

	//-------------------------------------------------------------------

	http.listen(3001, function(){
	  console.log('Socket IO: listening on *:3001');
	});


	io.on('connection', function(socket){
	  console.log('Socket IO: a user connected');
	  io.emit('data', "hihi");
	});






return app;
}




