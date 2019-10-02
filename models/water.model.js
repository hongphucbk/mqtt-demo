var mongoose = require('mongoose');
var waterSchema = new mongoose.Schema({
	station: String,
	name: String,
	data: Object,
	acknowleadge: Number,
	timestamp: Date
});

var Water = mongoose.model('Water', waterSchema, 'water');

module.exports = Water;