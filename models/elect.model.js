var mongoose = require('mongoose');
var electSchema = new mongoose.Schema({
	name: String,
	value: Object,
	timestamp: Date
});

var Elect = mongoose.model('Elect', electSchema, 'elect');

module.exports = Elect;