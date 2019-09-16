var mongoose = require('mongoose');
var stationSchema = new mongoose.Schema({
	name: String,
	description: String,
	address: String,
	information: String,
	note: String,
	maps_id: Number,
	posx: Number,
	posy: Number
});

var Station = mongoose.model('Station', stationSchema, 'stations');

module.exports = Station;