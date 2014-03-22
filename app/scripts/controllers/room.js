'use strict';

angular.module('scrumPokerApp')
  .controller('RoomCtrl', function ($scope, $routeParams, socket) {

    $scope.room_name = $routeParams.room_id;
    $scope.playing = false;

    socket.emit('hello', {name: "me", room: $scope.room_name})
    console.log('hello');

    $scope.votes = [];
    $scope.cards = [1, 2, 5, 8, 20, 40, 'C', '?'];
    $scope.guest_name = "guest"+Math.floor(Math.random()*10000);

    function onVote(data) {
        $scope.votes.push(data);
    }

    function onStart(story) {
        $scope.playing = true;
        if(typeof story.summary === "undefined") {
            story.summary = "No story defined";
        }
        $scope.current_story_summary = story.summary;
        console.log("blo"+$scope.current_story_summary);
    }

    socket.on('vote', function(data) {
        onVote(data);
    });

    socket.on('hello', function(data) {
        console.log(data.name);
    });

    socket.on('start', function(story) {
        onStart(story);
    });

    $scope.vote = function(value) {
        var vote = {
            user_name: $scope.user_name ? $scope.user_name : $scope.guest_name,
            id: new Date().getTime(),
            value: value

        };
        console.log(vote);
        $scope.votes.push(vote);
        socket.emit('vote', vote);
    };

    $scope.start = function() {
        var story = {
            summary: $scope.next_story_summary
        };
        onStart(story);
        socket.emit('start', story);
    }

  });
