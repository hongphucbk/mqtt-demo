const express = require('express')
const app = express()
const port = 3000

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static('public'));
var engine = require('ejs-locals');
app.engine('ejs', engine);


app.get('/', function(req, res) {
	res.render('layout/index');
}) 

app.get('/users', function(req, res) {
	res.render('users/list');
}) 

app.listen(port, function(){
	console.log(`Server listening on port ${port}!`)
});