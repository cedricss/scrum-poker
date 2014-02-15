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
	socket.on('joinRoom', function(data) {
		socket.broadcast.emit('onJoinRoom', data);
	});
	socket.on('submitVote', function(data) {
		socket.broadcast.emit('onVoteSubmitted', data);
	});
});


// Start server
server.listen(config.port, function () {
  console.log('Express server listening on port %d in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;