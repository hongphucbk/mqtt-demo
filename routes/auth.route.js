var express = require('express');
var router = express.Router();

router.use(express.static(__dirname + './public'));

var controller = require('../controllers/auth.controller');
//var validate = require('../validate/user.validate');

router.get('/login', controller.login);
router.post('/login', controller.postLogin);

// router.get('/add', controller.add);
// router.post('/add', validate.postAdd, controller.postAdd);

// router.get('/edit/:id', controller.getEdit);
// router.post('/edit/:id', controller.postEdit);

// router.get('/delete/:id', controller.getDelete);


// router.get('/', function(req, res) {
// 	res.render('users/list');
// });

// router.get('/add', function(req, res) {
// 	res.render('users/list');
// });


module.exports = router;
