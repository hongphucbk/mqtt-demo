var express = require('express');
var router = express.Router();

// router.use(express.static(__dirname + './public'));

var controller = require('../controllers/elect.controller');
var validate = require('../validate/station.validate');

router.get('/', controller.overview);
router.get('/station/:id', controller.station);

router.get('/station/:id/cabinet/:cabinet_id', controller.cabinet);
router.get('/station/:id/cabinet/:cabinet_id/chart', controller.chart);

router.get('/station/:id/cabinet/:cabinet_id/history', controller.history);

// router.get('/rt', controller.listRT);

// router.get('/excel', controller.listExcel);

// router.get('/control', controller.listControl);

// router.get('/add', controller.getAdd);
// router.post('/add', validate.postAdd, controller.postAdd);

// router.get('/edit/:id', controller.getEdit);
// router.post('/edit/:id', controller.postEdit);

// router.get('/delete/:id', controller.getDelete);

module.exports = router;
