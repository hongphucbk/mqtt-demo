var mongoose = require('mongoose');
var cabinetSchema = new mongoose.Schema({
	station_id: String,
	name: String,
	description: String,
	address: String,
	information: String,
	note: String,
	posx: Number,
	posy: Number,
	div_id: String,
});

var Cabinet = mongoose.model('Cabinet', cabinetSchema, 'cabinets');

module.exports = Cabinet;