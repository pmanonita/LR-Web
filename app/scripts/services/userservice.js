'use strict';

/**
 * @ngdoc service
 * @name lrwebApp.userservice
 * @description
 * # userservice
 * Service in the lrwebApp.
 */
angular.module('lrwebApp')
  .service('userservice', ['$rootScope', '$http', '$q', '$log', function ($rootScope, $http, $q, $log) {
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
      user.isLoggedIn = (user.email.length && user.emailVerified) || (user.mobile.length && user.mobileVerified);
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
    function _login(username, password) {
    	console.log("at login")
      //normalize input
      user = user || '';
      password = password || '';

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
      var o = {
        'username': username,
        'password': password
      }

      var $req = $http.post('http://localhost:8080/LRService/login/', o).$promise;

      //send ajax form submission
      $req.then(function(data, status, headers, config) {
        $log.debug('User Info + ' + JSON.stringify(data));

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

  }]);
