var mongoose = require('mongoose');
var stationSchema = new mongoose.Schema({
	name: String,
	description: String,
	address: String,
	information: String,
	note: String,
});

var Station = mongoose.model('Station', stationSchema, 'stations');

module.exports = Station;