'use strict';

/**
 * @ngdoc directive
 * @name lrwebApp.directive:compareTo
 * @description
 * # compareTo
 */
angular.module('lrwebApp')
  .directive('compareTo', function () {
    return {

      require: "ngModel",
      scope: {
          otherModelValue: "=compareTo"
      },
      link: function(scope, element, attributes, ngModel) {          
           console.log("Inside compareTo")

          ngModel.$validators.compareTo = function(modelValue) {
              return modelValue == scope.otherModelValue;
          };

          scope.$watch("otherModelValue", function() {
            console.log("inside compare to watch")
              ngModel.$validate();
          });
      }
    };
  });
