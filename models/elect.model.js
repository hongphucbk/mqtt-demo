var mongoose = require('mongoose');
var electSchema = new mongoose.Schema({
	station: String,
	name: String,
	value: Object,
	timestamp: Date
});

var Elect = mongoose.model('Elect', electSchema, 'elect');

module.exports = Elect;