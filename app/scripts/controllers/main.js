'use strict';

angular.module('scrumPokerApp')
  .controller('MainCtrl', function ($scope, $location) {
    function generateRoomName() {
        return Math.random().toString(36).substring(11); 
    }
    $scope.generateRoomName = function() {
        $scope.room_name = generateRoomName();
    }

    $scope.enterRoom = function(room_name) {
        if(room_name == undefined || room_name == "") {
            room_name = generateRoomName();
        } 
        $location.path("/room-"+room_name)
    }
  });
