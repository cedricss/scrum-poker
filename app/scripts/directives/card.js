'use strict';

angular.module('scrumPokerApp')
  .directive('card', function () {
    return {
      transclude: true,
      replace: true,
      restrict: 'E',
      scope: {
        value: '=',
        nextvalue: "=",
        vote: '&onClick'
      },

      template: '<span ng-class="{waiting: nextvalue==-1}" class="card card-position-{{value}}" ng-click="vote()">{{value}}</span>'
    };
  });
