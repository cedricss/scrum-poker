'use strict';

angular.module('scrumPokerApp')
  .controller('RoomCtrl', function ($scope, socket) {
    $scope.votes = [];

    socket.on('onVoteSubmitted', function(data) {
        $scope.votes.push(data);
    });

    $scope.submitVote = function() {
        var vote = {
            id: new Date().getTime(),
            vote: '?'

        };

        $scope.votes.push(vote);
        socket.emit('submitVote', vote);
    };
  });
