'use strict';

angular.module('scrumPokerApp')
  .directive('userVote', function (socket) {
    return {
      template: '<div></div>',
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        element.text('Vote submited!');
      }
    };
  });
