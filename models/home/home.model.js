var mongoose = require('mongoose');
var homeSchema = new mongoose.Schema({
	device_id: String,
	name: String,
	data: Object,
	acknowleadge: Number,
	timestamp: Date
});

var Home = mongoose.model('Home', homeSchema, 'home');

module.exports = Home;