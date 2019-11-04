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

module.exports.history1 = async function(req, res) {
	let stations = await Station.find();
	let waters = await Water.find();
	let oldWaters1 = await Water.find({name: "1"}).sort('-timestamp').limit(200);
	let oldWaters2 = await Water.find({name: "2"}).sort('-timestamp').limit(200);
	res.render('water/history1', {
		stations: stations,
		waters: waters,
		oldWaters1: oldWaters1,
		oldWaters2: oldWaters2,
		moment: moment,
	});
};


var i = 0;
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max)) + 1;
}

module.exports.history2 = async function(req, res) {
	let waters = await Water.find().limit(10);
	let recordsTotal  = await Water.countDocuments({});

	var dt1 = [];
	//{"_id":"5daa7d187578232f349c627c","station":"1","name":"1","data":80.2,"timestamp":"2019-10-19T03:03:52.629Z","__v":0}
	waters.forEach(function(water){
		let temp1 = [ water.station, water.name, water.data, water.timestamp ];
		dt1.push(temp1);
	});

	var data = JSON.stringify({
                "draw": getRandomInt(10),
                "recordsFiltered": recordsTotal,
                "recordsTotal": recordsTotal,
                "data": dt1
            });
	console.log( typeof(data))

	let data2 = {
		  "draw": 5,
		  "recordsTotal": 57,
		  "recordsFiltered": 57,
		  "data": [
		    [
		      "Airi",
		      "Satou",
		      "Accountant",
		      "Tokyo",
		      "28th Nov 08",
		      "$162,700"
		    ],
		    [
		      "Angelica",
		      "Ramos",
		      "Chief Executive Officer (CEO)",
		      "London",
		      "9th Oct 09",
		      "$1,200,000"
		    ],
		    [
		      "Ashton",
		      "Cox",
		      "Junior Technical Author",
		      "San Francisco",
		      "12th Jan 09",
		      "$86,000"
		    ],
		    [
		      "Bradley",
		      "Greer",
		      "Software Engineer",
		      "London",
		      "13th Oct 12",
		      "$132,000"
		    ],
		    [
		      "Brenden",
		      "Wagner",
		      "Software Engineer",
		      "San Francisco",
		      "7th Jun 11",
		      "$206,850"
		    ],
		    [
		      "Brielle",
		      "Williamson",
		      "Integration Specialist",
		      "New York",
		      "2nd Dec 12",
		      "$372,000"
		    ],
		    [
		      "Brenden",
		      "Wagner",
		      "Software Engineer",
		      "San Francisco",
		      "7th Jun 11",
		      "$206,850"
		    ],
		    [
		      "Brielle",
		      "Williamson",
		      "Integration Specialist",
		      "New York",
		      "2nd Dec 12",
		      "$372,000"
		    ],
		    [
		      "Bruno",
		      "Nash",
		      "Software Engineer",
		      "London",
		      "3rd May 11",
		      "$163,500"
		    ],
		    [
		      "Caesar",
		      "Vance",
		      "Pre-Sales Support",
		      "New York",
		      "12th Dec 11",
		      "$106,450"
		    ],
		    [
		      "Cara",
		      "Stevens",
		      "Sales Assistant",
		      "New York",
		      "6th Dec 11",
		      "$145,600"
		    ],
		    [
		      "Cedric",
		      "Kelly",
		      "Senior Javascript Developer",
		      "Edinburgh",
		      "29th Mar 12",
		      "$433,060"
		    ]
		  ]
		}
	// res.json(data);
  res.send(data);
};

module.exports.history3 = async function(req, res) {
  var perPage = 20
  var page = req.query.page || 1

	let stations = await Station.find();
	let waters = await Water.find().skip((perPage * page) - perPage).limit(perPage);
	let recordsTotal  = await Water.countDocuments({});

	let pages = Math.ceil(recordsTotal / perPage);

	console.log(page, pages, recordsTotal)
	res.render('water/history3', {
		stations: stations,
		waters: waters,
		current: page,
		pages: pages,
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

module.exports.chart2 = async function(req, res) {
	let stations = await Station.find();
	let waters = await Water.find({ $or: [ {data: { $gte: 80 }}, {data: { $lte: 20}} ] } ).sort('-timestamp').limit(30);
	// let oldWaters1 = await Water.find({name: "1"}).sort('-timestamp').limit(30);
	// let oldWaters2 = await Water.find({name: "2"}).sort('-timestamp').limit(30);

	let oldWaters1 = await Water.find({name: "1"}).sort('-timestamp').limit(20);
	let oldWaters2 = await Water.find({name: "2"}).sort('-timestamp').limit(20);

	let dt1 = [];
	let time1 = [];
	oldWaters1.forEach(function(water1){
		let temp1 = water1.data ;
		dt1.push(water1.data);
		time1.push(water1.timestamp)
	});

	var series = 
	{
	  "monthDataSeries1": {
	    "prices": dt1,
	    "dates": time1
	  }
	}

	res.render('water/chart2', {
		stations: stations,
		waters: waters,
		oldWaters1: oldWaters1,
		oldWaters2: oldWaters2,
		moment: moment,
		series: series,
	});
};


module.exports.apiChart = async function(req, res) {
	//let waters = await Water.find({ $or: [ {data: { $gte: 80 }}, {data: { $lte: 20}} ] } ).sort('-timestamp').limit(30);
	let oldWaters1 = await Water.find({name: "1"}).sort('-timestamp').limit(1500);
	let oldWaters2 = await Water.find({name: "2"}).sort('-timestamp').limit(1500);

	let dt1 = [];
	let time1 = [];
	oldWaters1.forEach(function(water1){
		let temp1 = water1.data ;
		dt1.push(water1.data);
		time1.push(water1.timestamp)
	});

	var series = 
	{
	  "monthDataSeries1": {
	    "prices": dt1,
	    "dates": time1
	  }
	}

	res.send(series);
};