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

var games_state = {};

io.sockets.on('connection', function(socket) {
  var room = "empty";

  function syncPlayers() {
    var players = {};
    var game = {};
    io.sockets.clients(room).forEach(function(client) {
      if(!client.playerdisconnected) {
        players[client.playerid] = {id:client.playerid, username:client.username, vote:client.vote};
      }
    });
    if(typeof games_state[room] === "undefined") {
      games_state[room] = {playing:false};
    }
    game.players = players;
    game.state = games_state[room];
    console.log(game);
    io.sockets.in(room).emit("hello", game);
  }

  socket.on('hello', function(player) {
    room = player.room;
    socket.join(room);
    socket.username = player.username;
    socket.playerid = player.id;
    socket.vote = 0;
    syncPlayers();
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
    if (room) {
      games_state[room].playing = true;
      socket.broadcast.to(room).emit('start', data);
    }else{
      console.log("no room");
    }
  });
  
  socket.on('stop', function(data) {
    if (room) {
      games_state[room].playing = false;
      socket.broadcast.to(room).emit('stop', data);
    }else{
      console.log("no room");
    }
  });

  socket.on('disconnect', function() {
    socket.playerdisconnected = true;
    syncPlayers();
  });

});

// Start server
server.listen(config.port, function () {
  console.log('Express server listening on port %d in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;