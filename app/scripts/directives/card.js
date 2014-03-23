'use strict';

angular.module('scrumPokerApp')
  .directive('card', function () {
    return {
      transclude: true,
      replace: true,
      restrict: 'E',
      scope: {
        value: '=',
        vote: '&onClick'
      },

      template: '<span class="card label label-primary card-position-{{value}}" ng-click="vote()">{{value}}</span>'
    };
  });
