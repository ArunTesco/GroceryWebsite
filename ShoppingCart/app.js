var express = require('express');
var app = express();
app.set('views', __dirname);
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(express.static(__dirname));
app.use(function(req, res, next){
res.header("Access-Control-Allow-Origin", "*");
res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
next();
});
app.listen(4000);
console.log('runing @ 4000');

app.get('/', function (req, res) {
res.render('index');
});

