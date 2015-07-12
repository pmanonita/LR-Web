angular.module('lrwebApp')
  .controller('HeaderCtrl', ['$scope', '$log', '$location', 'userService', function ($scope, $log, $location, userService) {
    
     $scope.isLoggedIn = userService.isLoggedIn();

     var user = userService.getUser();    
     $scope.username = user.firstName || user.name;     
     console.log("login at header "+$scope.isLoggedIn);
     console.log("username at header "+$scope.username);
    

      $scope.$on('user:updated', function() {
        var u = userService.getUser();
        $scope.isLoggedIn = u.isLoggedIn;
        $scope.username = u.firstName || u.name;
        $scope.profilePic = user.profilePic;
        $scope.initials = user.initials;
      
        console.log("login1 at header"+$scope.isLoggedIn);
    
    	console.log("username at header "+$scope.username);
    });

   
  }]);
          
  






 