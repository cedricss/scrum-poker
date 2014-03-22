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

	socket.on('hello', function(player) {
		var players = [];
		room = player.room;
		socket.join(room);
		socket.username = player.username;
		socket.playerid = player.id;
		console.log(io.sockets.clients(room));
		io.sockets.clients(room).forEach(function(client) {
    	players.push({id:client.playerid, username:client.username, vote:client.vote});
		});
		io.sockets.in(room).emit("hello", players);
	});

	socket.on('vote', function(vote) {
		if (room) {
			socket.vote = vote.value;
			socket.broadcast.to(room).emit('vote', vote);
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