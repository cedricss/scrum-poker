'use strict';

var express = require('express');

/**
 * Main application file
 */

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Application Config
var config = require('./lib/config/config');

var app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);

// Express settings
require('./lib/config/express')(app);

// Routing
require('./lib/routes')(app);

io.sockets.on('connection', function(socket) {
	var room = 'arf';
	socket.on('hello', function(data) {
		room = data.room;
		console.log(room);
		socket.join(room);
		socket.broadcast.to(room).emit('hello', data);
	});
	socket.on('vote', function(data) {
		if (room) {
			socket.broadcast.to(room).emit('vote', data);
		}else{
			console.log("no room");
		}
	});
	socket.on('start', function(data) {
		console.log(data.summary);
		if (room) {
			socket.broadcast.to(room).emit('start', data);
		}else{
			console.log("no room");
		}
	});
});

// Start server
server.listen(config.port, function () {
  console.log('Express server listening on port %d in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;