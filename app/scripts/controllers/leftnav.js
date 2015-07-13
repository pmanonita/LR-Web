  angular.module('lrwebApp')
    .controller('LeftNavCtrl', ['$scope', '$log', '$location', 'userService', function ($scope, $log, $location, userService) {
      
       $scope.isLoggedIn = userService.isLoggedIn();
       $scope.isAdmin = userService.isAdmin();     

        $scope.$on('user:updated', function() {
          var u = userService.getUser();
          $scope.isLoggedIn = u.isLoggedIn;
          $scope.isAdmin = userService.isAdmin();
      });

     
    }]);
            
    






   