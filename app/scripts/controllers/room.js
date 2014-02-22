'use strict';

angular.module('scrumPokerApp')
  .controller('RoomCtrl', function ($scope, $routeParams, socket) {

    $scope.room_name = $routeParams.room_id;

    socket.emit('hello', {name: "me", room: $scope.room_name})
    console.log('hello');

    $scope.votes = [];
    $scope.cards = [1, 2, 5, 8, 20, 40, 'C', '?'];

    socket.on('vote', function(data) {
        $scope.votes.push(data);
    });

    socket.on('hello', function(data) {
        console.log(data.name);
    });

    $scope.vote = function(value) {
        var vote = {
            id: new Date().getTime(),
            value: value

        };

        console.log(value);

        $scope.votes.push(vote);
        socket.emit('vote', vote);
    };
  });