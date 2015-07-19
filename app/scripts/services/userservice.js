'use strict';

/**
 * @ngdoc service
 * @name lrwebApp.userservice
 * @description
 * # userservice
 * Service in the lrwebApp.
 */
angular.module('lrwebApp')
  .service('userService', ['$rootScope', '$http', '$q', '$log', function ($rootScope, $http, $q, $log) {
    // AngularJS will instantiate a singleton by calling "new" on this function

   var _defUser = { //Default user object
          'isLoggedIn' : false,
          'isAdmin' : false,
          'id' : '',
          'name': '',
          'email': '',          
          'mobile': '',          
          'authToken': '',
          'firstName': '',
          'lastName': '',
          'role': ''
        },
        user = {},
        newuser = {},

        _defResult = {
          'sts' : false,
          'code': 0,
          'msg': 'Unexpected error.'
        };

        angular.merge(user, _defUser);

    function _updateRoleStatus() {
      if(user.role && user.role == 'admin') {
        user.isAdmin = true;
      }
      user.isAdmin = false;
    }
    //Notify changes in user data to all listeners
    function _userStatusNotify() {
      $rootScope.$broadcast('user:updated', user);
    }

    function _updateLoggedInStatus() {
      if (user.authToken && user.authToken.length > 0) {
        user.isLoggedIn = true;
      }
    }    

	  //Update user info from Parse API response
    function _updateUserInfo(u, bNotify) {
      console.log("updaing use details after logged in successful");
       if(angular.isUndefined(bNotify)) {
        bNotify = true;
      }
      user.email = u.email;
      user.mobile = u.mobile;
      user.name = u.userName;
      user.id = u.id;
      user.firstName = u.firstName
      user.lastName = u.lastName
      user.authToken = u.authToken;
      user.role = u.role;

      _updateLoggedInStatus();
      _updateRoleStatus();

      if(bNotify) {
        _userStatusNotify();
      }
    }


	function _parseErrorResponse(o) {
      //parse error response and return in expected format
      var ret = _defResult, err = {};

      if(o.code) {
        ret.code = o.code;
      }
      if(angular.isUndefined(o.error)){
        return ret;
      }

      
      if(angular.isObject(o.error) && o.error.message){
        ret.msg = o.error.message;
      } else if(angular.isString(o.error)){
        ret.msg = o.error;
        try {
          err = angular.fromJson(o.error);
          if(err && (err.message||err.errorCode)) {
            ret.msg = (err.message || err.errorCode);
          }
        }catch(e){}
      }

      return ret;
    }
    function _login(userData) {
    	console.log("at login")
      //normalize input
      var username = userData.username || '';
      var password = userData.password || '';

      var ret = _defResult, d = $q.defer();

      //input validation     
      if(!username.length || !password.length) {
        ret.msg = 'Invalid input!';
        d.reject(ret);
      }

      //set progress
      d.notify('Logging in');   
     
      var data = 'username=' + encodeURIComponent(username) + '&password=' +  encodeURIComponent(password);
      console.log(data);

      var config = { 
        headers: {
          'service_key': '824bb1e8-de0c-401c-9f83-8b1d18a0ca9d',
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      };    


      var $promise = $http.post('http://localhost:8080/LRService/v1/user-service/login', data, config);

      //send ajax form submission
      $promise.then(function(data, status, headers, config) {
        $log.debug('User Info + ' + JSON.stringify(data));

       // var result = data.data.result; // Fix it
       var result = data.data; 

        $log.debug(result);
        $log.debug(result.code);

        if(result.code !== 1) {
          //some error
          d.reject(ret);
          return;
        }

        /*Update all user info*/
        _updateUserInfo(result.user);
        ret.sts = true;
        d.resolve(ret);        

      }, function(r) {
      	$log.debug('Error Info + ' + JSON.stringify(r.data));
        ret = _parseErrorResponse(r.data);
        d.reject(ret);
      });
      //always return deferred object
      return d.promise;
    }

    function _signout() {
      console.log("At signout");
      var ret = _defResult, d = $q.defer(), p = d.promise;
      
      //pre-check      
      if(user.id == "") {
        d.reject(ret);
        return p;
      }

      //signout the user
      console.log("Signout process started")
      var data = {}      
      var config = { 
        headers: {
          'service_key': '824bb1e8-de0c-401c-9f83-8b1d18a0ca9d',
          'auth_token' : user.authToken,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      };    

      console.log(config.headers.auth_token);


      var $promise = $http.post('http://localhost:8080/LRService/v1/user-service/logout', data, config);

      $promise.finally(function() {
        //irrespective of success or failure status
        //delete the object
        angular.merge(user, _defUser);
        ret.sts = true;
        ret.msg = '';
        d.resolve(ret);
        _updateLoggedInStatus();
        _userStatusNotify();
      });
      return p;
    }

    function _updateNewUserInfo(u, bNotify) {
      console.log("updaing new use details after logged in successful");
      
      newuser.email = u.email;
      newuser.mobile = u.mobile;
      newuser.name = u.userName;
      newuser.id = u.id;
      newuser.firstName = u.firstName
      newuser.lastName = u.lastName
      newuser.authToken = u.authToken;
      newuser.role = u.role; 

      $log.debug('New user :' + JSON.stringify(newuser));
    }
    // Admin can call this function. Store the new user data to a diff object
    function _signup(userData) {
      console.log("at createuser")
      newuser = {
        'id' : '',
        'name': '',
        'email': '',          
        'mobile': '',          
        'authToken': '',
        'firstName': '',
        'lastName': '',
        'role': ''
      };
      //normalize input
      var username = userData.username || '';
      var password = userData.password || '';
      var firstname = userData.firstname || '';
      var lastname = userData.lastname || '';
      var email = userData.email || '';
      var mobile = userData.mobile || '';
      var role = userData.role || 'default';

      var ret = _defResult, d = $q.defer();

      //input validation 
      if(!username.length || !password.length) {
        ret.msg = 'Invalid input!';
        d.reject(ret);
      }

      //set progress
      d.notify('Creating user');
      
      var data = 'userName=' + encodeURIComponent(username) + 
                 '&password=' +  encodeURIComponent(password) +
                 '&firstName=' + firstname +
                 '&lastName=' + lastname +
                 '&email=' + email +
                 '&mobile=' + mobile +
                 '&role=' + role;

      console.log(data);

      var config = { 
        headers: {
          'service_key': '824bb1e8-de0c-401c-9f83-8b1d18a0ca9d',
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      };

      var $promise = $http.post('http://localhost:8080/LRService/v1/user-service/signup', data, config);

      //send ajax form submission
      $promise.then(function(data, status, headers, config) {
        $log.debug('User Info + ' + JSON.stringify(data));

        var result = data.data; // Fix it

        $log.debug(result);
        $log.debug(result.code);

        if(result.code !== 1) {
          //some error
          d.reject(ret);
          return;
        }

        /*Update all user info*/
        _updateNewUserInfo(result.user);
        ret.sts = true;
        d.resolve(ret);        

      }, function(r) {
        $log.debug('Error Info + ' + JSON.stringify(r.data));
        ret = _parseErrorResponse(r.data);
        d.reject(ret);
      });
      //always return deferred object
      return d.promise;
    }
    return {
      isLoggedIn: function() { return user.isLoggedIn; },
      isAdmin: function() { return user.isAdmin; },      

      getAuthToken: function() { return user.authToken;},
      getUser: function() {return user;},      
      login: _login,
      signup:_signup,
      signout: _signout
    };

  }]);
