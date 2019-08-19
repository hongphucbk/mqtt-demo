var Station = require('../models/station.model');

module.exports.list = function(req, res) {
	Station.find().then(function(stations){
		res.render('overview/list', {
			stations: stations
		})
	})
};

// module.exports.getAdd = function(req, res) {
// 	Station.find().then(function(stations){
// 		res.render('stations/add', {
// 			stations: stations
// 		});
// 	});
// };

// module.exports.postAdd = function(req, res) {
// 	console.log(req.body);
// 	// or, for inserting large batches of documents
// 	Station.insertMany(req.body, function(err) {
// 		if (err) return handleError(err);
// 	});
// 	res.redirect('/station');
// };