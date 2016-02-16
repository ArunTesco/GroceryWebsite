var express = require('express');
var gcm = require('node-gcm');
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
    res.render('index.html');
});

app.get('/push', function(req, res){

    var device_tokens = []; //create array for storing device tokens
    var retry_times = 4; //the number of times to retry sending the message if it fails

    var sender = new gcm.Sender('Your GCM API KEY'); //create a new sender
    var message = new gcm.Message(); //create a new message

    message.addData('title', 'Hello');
    message.addData('message', 'Hello this is a push notification');
    message.addData('sound', 'notification');

    message.collapseKey = 'testing'; //grouping messages
    message.delayWhileIdle = true; //delay sending while receiving device is offline
    message.timeToLive = 3; //the number of seconds to keep the message on the server if the device is offline
	var device_token=req.query.q;
    device_tokens.push(device_token);

    sender.send(message, device_tokens, retry_times, function(err, response){
        if(err) {
      console.error(err);
    } else {
      console.log(response);
    }
    });

    res.send('ok');
});