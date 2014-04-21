'use strict';

angular.module('scrumPokerApp')
  .directive('card', function () {
    return {
      transclude: true,
      replace: true,
      restrict: 'E',
      scope: {
        value: '=',
        playing: "=",
        type: '=',
        vote: '&onClick'
      },

      templateUrl: 'partials/card.html'

          };
  });
