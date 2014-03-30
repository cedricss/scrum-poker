'use strict';

angular.module('scrumPokerApp')
  .controller('RoomCtrl', function ($scope, $routeParams, socket) {

    $scope.room_name = $routeParams.room_id;
    $scope.playing = false;
    $scope.players = {};
    $scope.cards = [1, 2, 5, 8, 20, 40, 'C', '?'];
    $scope.guest_name = "guest"+Math.floor(Math.random()*10000);
    $scope.id = new Date().getTime();

    function getUsername() {
        return $scope.user_name ? $scope.user_name : $scope.guest_name;
    }

    function addVote(players, vote) {
        console.log(players);
        players[vote.playerid].next_vote = vote.value;
        if (vote.playerid == $scope.id) {
            //players[vote.playerid].vote = vote.value;
        }
        var end = true;
        for (var playerid in players) {
            console.log(players[playerid].next_vote);
            if (players[playerid].next_vote == -1) {
                end = false;
            }
        }
        if (end) {
            for (var playerid in players) {
                 players[playerid].vote =  players[playerid].next_vote;
            }
            $scope.playing = false;
        }
    }

    function onVote(vote) {
        addVote($scope.players, vote);
    }

    function resetVote() {
        for (var id in $scope.players) {
            $scope.players[id].vote = -1;
            $scope.players[id].next_vote = -1;
        }
        $scope.current_story_summary = undefined;
    }

    function onStart(story) {
        $scope.playing = true;
        resetVote();
        $scope.next_story_summary = undefined;
        if(typeof story.summary === "undefined") {
            story.summary = "No story defined";
        }
        $scope.current_story_summary = story.summary;
        console.log("blo"+$scope.current_story_summary);
    }

    function onStop() {
         $scope.playing = false;
         resetVote();
    }

    socket.emit('hello', {id: $scope.id, username: getUsername(), room: $scope.room_name});

    socket.on('vote', function(data) { onVote(data); });

    socket.on('hello', function(game) {
        console.log(game);
        $scope.players = game.players;
        $scope.playing = game.state.playing;
    });

    socket.on('start', function(story) {
        onStart(story);
    });

    socket.on('stop', function(story) {
        onStop();
    });

    $scope.vote = function(value) {
        var vote = {
            playerid: $scope.id,
            value: value
        };
        console.log(vote);
        onVote(vote);
        socket.emit('vote', vote);
    };

    $scope.start = function() {
        var story = {
            summary: $scope.next_story_summary
        };
        onStart(story);
        socket.emit('start', story);
    }

    $scope.stop = function() {
        onStop();
        socket.emit('stop');
    }

  });
