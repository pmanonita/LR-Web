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

    var _defUser = {
          'isLoggedIn' : false,
          'name': '',
          'oID': '',
          'sToken': '',          
        },
        user = _defUser,    //Default user object
        _defResult = {
          'sts' : false,
          'code': 1,
          'msg': 'Unexpected error.'
        };

    //Notify changes in user data to all listeners
    function _userStatusNotify() {
      $rootScope.$broadcast('user:updated', user);
    }

    function _updateLoggedInStatus() {
      user.isLoggedIn = true;
    }

	//Update user info from Parse API response
    function _updateUserInfo(u, bNotify) {
      bNotify = bNotify || true;      
      user.name = u.username;
      user.oID = u.objectId;
      user.sToken = u.sessionToken;
      _updateLoggedInStatus();
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

      //error message is returned as string instead of object occasionally :(
      if(angular.isObject(o.error) && o.error.message){
        ret.msg = o.error.message;
      } else if(angular.isString(o.error)){
        ret.msg = o.error;
        try {
          err = angular.fromJson(o.error);
          if(err && (err.message||err.status)) {
            ret.msg = (err.message || err.status);
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
      //validation as per rule, should be done in the controller. We do
      //minimum empty check here.
      if(!username.length || !password.length) {
        ret.msg = 'Invalid input!';
        d.reject(ret);
      }

      //set progress
      d.notify('Logging in');
      //var o = {
      //  'username': username,
      // 'password': password
      //}
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

        //Temp return. to-do fix me
        return d.promise;

        if(data.result.code !== 1) {
          //some error
          d.reject(ret);
          return;
        }

        /*Update all user info*/
        _updateUserInfo(data.result.user);
        ret.sts = true;
        d.resolve(ret);        

      }, function(r) {
        ret = _parseErrorResponse(r.data);
        d.reject(ret);
      });
      //always return deferred object
      return d.promise;
    }
    return {
      isLoggedIn: function() { return user.isLoggedIn; },
      getSessionToken: function() { return user.sToken;},
      getUser: function() {return user;},
      login: _login,
    };

  }]);
