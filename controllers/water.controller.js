var Elect = require('../models/elect.model')
const excel = require('node-excel-export');
var Station = require('../models/station.model')
var Cabinet = require('../models/cabinet.model')
var Water = require('../models/water.model')
var moment = require('moment');

module.exports.overview = async function(req, res) {
	// Station.find().then(function(stations){
	// 	res.render('water/overview', {
	// 		stations: stations
	// 	});
	// });
	// Station.find().then(function(stations){
	// 	res.render('water/overview', {
	// 		stations: stations
	// 	});
	// });
	let stations = await Station.find();
	let waters = await Water.find({ $or: [ {data: { $gte: 80 }}, {data: { $lte: 20}} ] } ).sort('-timestamp').limit(100);
	let oldWaters1 = await Water.find({name: "1"}).sort('-timestamp').limit(30);
	let oldWaters2 = await Water.find({name: "2"}).sort('-timestamp').limit(30);
	let totalAlarm = await Water.countDocuments({ $or: [ {data: { $gte: 80 }}, {data: { $lte: 20}} ] });
	let totalRecord  = await Water.countDocuments({});
	let totalAlarmAck = await Water.countDocuments({acknowleadge: 1});

	let percentAlarm = totalAlarm *100 / totalRecord;
	let percentAlarmAck = totalAlarmAck*100 / totalAlarm;
	res.render('water/overview', {
		stations: stations,
		waters: waters,
		oldWaters1: oldWaters1,
		oldWaters2: oldWaters2,
		moment: moment,
		percentAlarm: percentAlarm,
		percentAlarmAck: percentAlarmAck, 
	});
};


module.exports.history = async function(req, res) {
	let stations = await Station.find();
	let waters = await Water.find();
	let oldWaters1 = await Water.find({name: "1"}).sort('-timestamp').limit(200);
	let oldWaters2 = await Water.find({name: "2"}).sort('-timestamp').limit(200);
	res.render('water/history', {
		stations: stations,
		waters: waters,
		oldWaters1: oldWaters1,
		oldWaters2: oldWaters2,
		moment: moment,
	});
};


module.exports.acknowleadge = async function(req, res) {
	let query = {"_id": req.params.id};
	let data = {
		"acknowleadge" : 1,
	}
	let water = await Water.findOneAndUpdate(query, data, {'upsert':true});
	let stations = await Station.find();
	let waters = await Water.find({ $or: [ {data: { $gte: 80 }}, {data: { $lte: 20}} ] } ).sort('-timestamp').limit(10);
	let oldWaters1 = await Water.find({name: "1"}).sort('-timestamp').limit(30);
	let oldWaters2 = await Water.find({name: "2"}).sort('-timestamp').limit(30);
	res.redirect('/water');


	res.render('water/overview', {
		stations: stations,
		waters: waters,
		oldWaters1: oldWaters1,
		oldWaters2: oldWaters2,
		moment: moment,
	});
};

module.exports.listExcel = async function(req, res) {
	let waters = await Water.find().sort('-timestamp').limit(2000);
	let data = []
	let temp1;
	let temp2;
	waters.forEach(function(water) {
		temp2 = "";
		if (water.data > 80) {
			temp2 = "Hight"
		}
		if (water.data < 20) {
			temp2 = "Low"
		}

		temp1 = {station: 1, name: water.name, value: water.data, alarm: temp2, time: water.timestamp }  // moment().format('MMMM Do YYYY, h:mm:ss a');
		data.push(temp1)
	})
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
	      underline: false
	    }
	  },
	  headerBlue: {
	    fill: {
	      fgColor: {
	        rgb: '00c8fa'
	      }
	    },
	    font: {
	      color: {
	        rgb: 'FFFFFFFF'
	      },
	      sz: 14,
	      bold: true,
	      underline: false
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
	  },
	  cellRed: {
	    fill: {
	      fgColor: {
	        rgb: 'f5938c'
	      }
	    }
	  },
	  cellYellow: {
	    fill: {
	      fgColor: {
	        rgb: 'eff59d'
	      }
	    }
	  },
	  cellWhite: {
	    fill: {
	      fgColor: {
	        rgb: 'ffffff'
	      }
	    }
	  }
	};
	 
	//Array of objects representing heading rows (very top)
	const heading = [
	  [ {value: 'BÁO CÁO THỐNG KÊ', style: styles.headerBlue}, 
	    // {value: 'b1', style: styles.headerDark}, 
	    // {value: 'c1', style: styles.headerDark} ],
	    ]
	  //['a2', 'b2', 'c2'] // <-- It can be only values
	];
	 
	//Here you specify the export structure
	const specification = {
	  station: { // <- the key should match the actual data key
	    displayName: 'TRẠM', // <- Here you specify the column header
	    headerStyle: styles.headerDark, // <- Header style
	    
	    width: 40 // <- width in pixels
	  },
	  name: {
	    displayName: 'TÊN BỒN',
	    headerStyle: styles.headerDark,
	    // cellFormat: function(value, row) { // <- Renderer function, you can access also any row.property
	    //   return (value == 1) ? 'Active' : 'Inactive';
	    // },
	    width: 50 // <- width in chars (when the number is passed as string)
	  },
	  value: {
	    displayName: 'GIÁ TRỊ',
	    headerStyle: styles.headerDark,
	    //cellStyle: styles.cellPink, // <- Cell style
	    // cellStyle: function(value, row) { // <- style renderer function
	    //   // if the status is 1 then color in green else color in red
	    //   // Notice how we use another cell value to style the current one
	    //   return (row.value <= 80 & row.value >= 20) ? styles.cellGreen : {fill: {fgColor: {rgb: 'FFFF0000'}}}; // <- Inline cell style is possible 
	    // },
	    width: 100 // <- width in pixels
	  },
	  alarm: {
	    displayName: 'CẢNH BÁO',
	    headerStyle: styles.headerDark,
	    //cellStyle: styles.cellPink, // <- Cell style
	    cellStyle: function(value, row) { // <- style renderer function
	      // if the status is 1 then color in green else color in red
	      // Notice how we use another cell value to style the current one
	      if (row.value > 80) {
	      	return styles.cellRed
	      }
	      if (row.value < 20) {
	      	return styles.cellYellow
	      }
	      return styles.cellWhite

	    },
	    width: 100 // <- width in pixels
	  },
	  time: {
	    displayName: 'THỜI GIAN',
	    headerStyle: styles.headerDark,
	    //cellStyle: styles.cellPink, // <- Cell style
	    width: 200 // <- width in pixels
	  }
	}
	 
	// The data set should have the following shape (Array of Objects)
	// The order of the keys is irrelevant, it is also irrelevant if the
	// dataset contains more fields as the report is build based on the
	// specification provided above. But you should have all the fields
	// that are listed in the report specification
	// const dataset = [
	//   {station: '1', status_id: 1, note: 'some note', misc: 'not shown'},
	//   {station: '1', status_id: 0, note: 'some note'},
	//   {station: '1', status_id: 0, note: 'some note', misc: 'not shown'}
	// ]

	const dataset = data;
	 
	// Define an array of merges. 1-1 = A:1
	// The merges are independent of the data.
	// A merge will overwrite all data _not_ in the top-left cell.
	const merges = [
	  { start: { row: 1, column: 1 }, end: { row: 1, column: 5 } },
	  // { start: { row: 2, column: 1 }, end: { row: 2, column: 5 } },
	  // { start: { row: 2, column: 6 }, end: { row: 2, column: 10 } }
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
	res.attachment('Report.xlsx'); // This is sails.js specific (in general you need to set headers)
	return res.send(report);
	 
	// OR you can save this buffer to the disk by creating a file.
};

module.exports.chart = async function(req, res) {
	let stations = await Station.find();
	let waters = await Water.find({ $or: [ {data: { $gte: 80 }}, {data: { $lte: 20}} ] } ).sort('-timestamp').limit(30);
	let oldWaters1 = await Water.find({name: "1"}).sort('-timestamp').limit(30);
	let oldWaters2 = await Water.find({name: "2"}).sort('-timestamp').limit(30);
	res.render('water/chart', {
		stations: stations,
		waters: waters,
		oldWaters1: oldWaters1,
		oldWaters2: oldWaters2,
		moment: moment,
	});
};