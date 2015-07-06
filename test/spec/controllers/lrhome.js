'use strict';

describe('Controller: LrhomeCtrl', function () {

  // load the controller's module
  beforeEach(module('lrwebApp'));

  var LrhomeCtrl;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    LrhomeCtrl = $controller('LrhomeCtrl', {
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(LrhomeCtrl.awesomeThings.length).toBe(3);
  });
});
