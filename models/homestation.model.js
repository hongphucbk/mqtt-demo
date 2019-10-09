var mongoose = require('mongoose');
var homeStationSchema = new mongoose.Schema({
	name: String,
	description: String,
	address: String,
	information: String,
	note: String,
	maps_id: Number,
	posx: Number,
	posy: Number,
});

var HomeStation = mongoose.model('HomeStation', homeStationSchema, 'homestations');

module.exports = HomeStation;