var Elect = require('../models/elect.model')
const excel = require('node-excel-export');
var Station = require('../models/station.model')
var Cabinet = require('../models/cabinet.model')

module.exports.overview = function(req, res) {
	Station.find().then(function(stations){
		res.render('elect/overview', {
			stations: stations
		});
	});
};

module.exports.station = function(req, res) {
	var id = req.params.id;
	Station.findById(id).then(function(station){
		res.render('elect/station', {
			station: station
		});
	});
};



// Elect.find().sort({ _id: -1 }).limit(10).then(function(elects){
// 		res.render('elect/list', {
// 			elects: elects
// 		});
// 	});

module.exports.list = function(req, res) {
	Elect.find().sort({ _id: -1 }).limit(10).then(function(elects){
		res.render('elect/list', {
			elects: elects
		});
	});
};

module.exports.listRT = function(req, res) {
	res.render('elect/listRT', {
			elects: null
		});
};


module.exports.dlistExcel = function(req, res) {
	res.send("hihi");
}

module.exports.listExcel = function(req, res) {
	// Elect.find().then(function(stations){
	// 	res.render('elect/excel', {
	// 		stations: stations
	// 	});
	// });

	// You can define styles as json object
	const styles = {
	  headerDark: {
	    fill: {
	      fgColor: {
	        rgb: 'FF000000'
	      }
	    },
	    font: {
	      color: {
	        rgb: 'FFFFFFFF'
	      },
	      sz: 14,
	      bold: true,
	      underline: true
	    }
	  },
	  cellPink: {
	    fill: {
	      fgColor: {
	        rgb: 'FFFFCCFF'
	      }
	    }
	  },
	  cellGreen: {
	    fill: {
	      fgColor: {
	        rgb: 'FF00FF00'
	      }
	    }
	  }
	};
	 
	//Array of objects representing heading rows (very top)
	const heading = [
	  [ {value: 'a1', style: styles.headerDark}, 
	    {value: 'b1', style: styles.headerDark}, 
	    {value: 'c1', style: styles.headerDark} ],
	  ['a2', 'b2', 'c2'] // <-- It can be only values
	];
	 
	//Here you specify the export structure
	const specification = {
	  customer_name: { // <- the key should match the actual data key
	    displayName: 'Customer', // <- Here you specify the column header
	    headerStyle: styles.headerDark, // <- Header style
	    cellStyle: function(value, row) { // <- style renderer function
	      // if the status is 1 then color in green else color in red
	      // Notice how we use another cell value to style the current one
	      return (row.status_id == 1) ? styles.cellGreen : {fill: {fgColor: {rgb: 'FFFF0000'}}}; // <- Inline cell style is possible 
	    },
	    width: 120 // <- width in pixels
	  },
	  status_id: {
	    displayName: 'Status',
	    headerStyle: styles.headerDark,
	    cellFormat: function(value, row) { // <- Renderer function, you can access also any row.property
	      return (value == 1) ? 'Active' : 'Inactive';
	    },
	    width: '10' // <- width in chars (when the number is passed as string)
	  },
	  note: {
	    displayName: 'Description',
	    headerStyle: styles.headerDark,
	    cellStyle: styles.cellPink, // <- Cell style
	    width: 220 // <- width in pixels
	  }
	}
	 
	// The data set should have the following shape (Array of Objects)
	// The order of the keys is irrelevant, it is also irrelevant if the
	// dataset contains more fields as the report is build based on the
	// specification provided above. But you should have all the fields
	// that are listed in the report specification
	const dataset = [
	  {customer_name: 'IBM', status_id: 1, note: 'some note', misc: 'not shown'},
	  {customer_name: 'HP', status_id: 0, note: 'some note'},
	  {customer_name: 'MS', status_id: 0, note: 'some note', misc: 'not shown'}
	]
	 
	// Define an array of merges. 1-1 = A:1
	// The merges are independent of the data.
	// A merge will overwrite all data _not_ in the top-left cell.
	const merges = [
	  { start: { row: 1, column: 1 }, end: { row: 1, column: 10 } },
	  { start: { row: 2, column: 1 }, end: { row: 2, column: 5 } },
	  { start: { row: 2, column: 6 }, end: { row: 2, column: 10 } }
	]
	 
	// Create the excel report.
	// This function will return Buffer
	const report = excel.buildExport(
	  [ // <- Notice that this is an array. Pass multiple sheets to create multi sheet report
	    {
	      name: 'Report', // <- Specify sheet name (optional)
	      heading: heading, // <- Raw heading array (optional)
	      merges: merges, // <- Merge cell ranges
	      specification: specification, // <- Report specification
	      data: dataset // <-- Report data
	    }
	  ]
	);
	 
	// You can then return this straight
	res.attachment('report.xlsx'); // This is sails.js specific (in general you need to set headers)
	return res.send(report);
	 
	// OR you can save this buffer to the disk by creating a file.

};

module.exports.listControl = function(req, res) {
	res.render('elect/control', {
			elects: null
		});
};

// module.exports.postAdd = function(req, res) {
// 	console.log(req.body);
// 	// or, for inserting large batches of documents
// 	Station.insertMany(req.body, function(err) {
// 		if (err) return handleError(err);
// 	});
// 	res.redirect('/station');
// };

// module.exports.getEdit = function(req, res) {
// 	var id = req.params.id;
// 	Station.findById(id).then(function(station){
// 		res.render('stations/edit', {
// 			station: station
// 		});
// 	});
// };

// module.exports.postEdit = function(req, res) {
// 	var query = {"_id": req.params.id};
// 	var data = {
// 		"name" : req.body.name,
// 	    "description" : req.body.description,
// 	    "address" : req.body.address,
// 	    "information" : req.body.information,
// 	    "note" : req.body.note
// 	}

// 	console.log(query)
// 	Station.findOneAndUpdate(query, data, {'upsert':true}, function(err, doc){
// 	    if (err) return res.send(500, { error: err });
// 	    res.redirect('/station');
// 	});

// };

// module.exports.getDelete = function(req, res) {
// 	var id = req.params.id;
// 	Station.findByIdAndDelete(id, function(err, doc){
// 	    if (err) return res.send(500, { error: err });
// 	    res.redirect('/station');
// 	});

// };