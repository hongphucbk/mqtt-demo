var mongoose = require('mongoose');
var DeviceSchema = new mongoose.Schema({
	station_id: String,
	name: String,
	description: String,
	information: String,
	note: String,
});

var Device = mongoose.model('Device', DeviceSchema, 'home-device');

module.exports = Device;