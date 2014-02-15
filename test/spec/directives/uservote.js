'use strict';

describe('Directive: userVote', function () {

  // load the directive's module
  beforeEach(module('scrumPokerApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<user-vote></user-vote>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the userVote directive');
  }));
});
