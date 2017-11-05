
var favicon = require('serve-favicon');
var ForgeRoute = require('./routes/ForgeRoute');
var express = require('express');
var app = express();
var server = require('http').Server(app);

var io = require('socket.io')(server);
io.on('connection', function(socket){
    console.log('connected');

    socket.on('au_Gyro', function(msg){
        console.log('sending IoT  : ' + msg );
        io.emit('au_Gyro' , msg);
    });
});
app.io = io;

app.use('/', express.static(__dirname+ '/www') );
app.use(favicon(__dirname + '/www/images/favicon.ico'));
app.use('/ForgeRoute', ForgeRoute);

app.set('port', process.env.PORT || 3001);

server.listen(app.get('port'), function() {
    console.log('Server listening on port ' + server.address().port);
});



