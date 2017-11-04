var express = require('express');

var app = express();
var server = require('http').Server(app); 

app.use('/', express.static(__dirname+ '/www') );   

app.set('port', process.env.PORT || 3003);

server.listen(app.get('port'), function() {
    console.log('Server listening on port ' + server.address().port);
});
