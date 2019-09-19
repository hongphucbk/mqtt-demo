var Station = require('../models/station.model')
var Cabinet = require('../models/cabinet.model')

module.exports.list = function(req, res) {
	Cabinet.find().then(function(cabinets){
		res.render('cabinet/list', {
			cabinets: cabinets
		});
	});
};

module.exports.getAdd = function(req, res) {
	Station.find().then(function(stations){
		res.render('cabinet/add', {
			stations: stations
		});
	});
};

module.exports.postAdd = function(req, res) {
	console.log(req.body);
	// or, for inserting large batches of documents
	Cabinet.insertMany(req.body, function(err) {
		if (err) return handleError(err);
	});
	res.redirect('/cabinet');
};

module.exports.getEdit = function(req, res) {
	var id = req.params.id;
	// console.log(id)
	Cabinet.findById(id).then(function(cabinet){
		// console.log(cabinet.station_id)
		Station.findById(cabinet.station_id).then(function(station){
			Station.find().then(function(stations){
				res.render('cabinet/edit', {
					stations: stations,
					station: station,
					cabinet: cabinet
				});
			});
		});
	});
};

module.exports.postEdit = function(req, res) {
	var query = {"_id": req.params.id};
	var data = {
		"station_id" : req.body.station_id,
		"name" : req.body.name,
	    "description" : req.body.description,
	    "address" : req.body.address,
	    "information" : req.body.information,
	    "note" : req.body.note,
		"posx" :  req.body.posx,
		"posy" :  req.body.posy,
		"div_id" :  req.body.div_id,
	}

	console.log(query)
	Cabinet.findOneAndUpdate(query, data, {'upsert':true}, function(err, doc){
	    if (err) return res.send(500, { error: err });
	    res.redirect('/cabinet');
	});

};

module.exports.getDelete = function(req, res) {
	var id = req.params.id;
	Cabinet.findByIdAndDelete(id, function(err, doc){
	    if (err) return res.send(500, { error: err });
	    res.redirect('/cabinet');
	});

};