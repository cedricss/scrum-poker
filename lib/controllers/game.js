var games_state = {};

module.exports = function(io, socket) {

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

  function hello(player) {
    room = player.room;
    socket.join(room);
    socket.username = player.username;
    socket.playerid = player.id;
    socket.vote = 0;
    syncPlayers();
  }

  function vote(vote) {
    if (room) {
      socket.vote = vote.value;
      socket.broadcast.to(room).emit('vote', vote);
    }else{
      console.log("no room");
    }
  }

  function start(data) {
    if (room) {
      games_state[room].playing = true;
      socket.broadcast.to(room).emit('start', data);
    }else{
      console.log("no room");
    }
  }

  function stop(data) {
    if (room) {
      games_state[room].playing = false;
      socket.broadcast.to(room).emit('stop', data);
    }else{
      console.log("no room");
    }
  }

  function disconnect() {
    socket.playerdisconnected = true;
    syncPlayers();
  }

  socket.on('hello', hello);
  socket.on('vote', vote);
  socket.on('start', start); 
  socket.on('stop', stop);
  socket.on('disconnect', disconnect);

};