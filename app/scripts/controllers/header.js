  angular.module('lrwebApp')
    .controller('HeaderCtrl', ['$rootScope', '$scope', '$log', '$location', 'userService',
      function ($rootScope, $scope, $log, $location, userService) {

        $scope.isLoggedIn = userService.isLoggedIn();
        $scope.isAdmin = userService.isAdmin();     

        var user = userService.getUser();    
        $scope.username = user.firstName || user.name;    

        $scope.signout = function(){
          //signout the user
          userService.signout().finally(function() {            
            $log.debug('After logging out ' + JSON.stringify(userService.getUser()));
            $location.path('#/');
          });
          return false;
        };

        $scope.$on('user:updated', function() {
          var u = userService.getUser();
          $scope.isLoggedIn = u.isLoggedIn;
          $scope.username = u.name || u.firstName;
          $scope.profilePic = u.profilePic;
          $scope.initials = u.initials;        
          $scope.isAdmin = userService.isAdmin();
        });
        
        $rootScope.$on('$routeChangeSuccess', function() {
          var view = $location.path();
          console.log(view);
          
          var LrViews = ['/lrhome', '/createlr', '/editlr', '/lrreports'];

          if(LrViews.indexOf(view) >= 0) {            
            $scope.isLRActive = true;          
          } else {
            $scope.isLRActive = false;
          }

          var MultiLrViews = ['/createmultilr', '/searchmultilr', '/editmultilr'];                    
          if(MultiLrViews.indexOf(view) >= 0) {            
            $scope.isMultiLRActive = true;          
          } else {
            $scope.isMultiLRActive = false;
          }

          var ExpenseViews = ['/createexpense', '/searchexpense'];                    
          if(ExpenseViews.indexOf(view) >= 0) {            
            $scope.isExpenseActive = true;          
          } else {
            $scope.isExpenseActive = false;
          }

          var UserViews = ['/createuser', '/searchuser'];                    
          if(UserViews.indexOf(view) >= 0) {            
            $scope.isUserActive = true;          
          } else {
            $scope.isUserActive = false;
          }          
        });
        
     
    }]);   