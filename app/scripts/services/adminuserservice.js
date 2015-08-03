'use strict';

/**
 * @ngdoc service
 * @name lrwebApp.userservice
 * @description
 * # userservice
 * Service in the lrwebApp.
 */
angular.module('lrwebApp')
  .service('adminUserService', ['$rootScope','$cacheFactory', 'userService', '$http', '$q', '$log', function ($rootScope, $cacheFactory, userService, $http, $q, $log) {

   var user = {};
   var _defResult = {
          'sts' : false,
          'code': 0,
          'msg': 'Unexpected error.'
        };

    var cache = $cacheFactory('userSearchData')



    function _parseErrorResponse(o) {
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
    
    
    function _updateUserInfo(u, bNotify) {
      console.log("updaing new use details after logged in successful");
      
      user.id        = u.id;
      user.name      = u.userName;
      user.firstName = u.firstName
      user.lastName  = u.lastName
      user.email     = u.email;
      user.mobile    = u.mobile;      
      user.role      = u.role; 

      $log.debug('New user :' + JSON.stringify(user));
    }
    
    function _createUser(userData) {
      $log.debug(userData);
      
      var userName  = userData.userName || '';
      var password  = userData.password || '';
      var firstName = userData.firstName || '';
      var lastName  = userData.lastName || '';
      var email     = userData.email || '';
      var mobile    = userData.mobile || '';
      var role      = userData.role || 'Normal';

      var ret = _defResult, d = $q.defer();

      //input validation 
      if(!userName.length || !password.length) {
        ret.msg = 'Invalid input!';
        d.reject(ret);
      }
      
      var data = 'userName=' + encodeURIComponent(userName) + 
                 '&password=' +  encodeURIComponent(password) +
                 '&firstName=' + firstName +
                 '&lastName=' + lastName +
                 '&email=' + email +
                 '&mobile=' + mobile +
                 '&role=' + role;

      var config = { 
        headers: {
          'service_key': '824bb1e8-de0c-401c-9f83-8b1d18a0ca9d',
          'auth_token' : userService.getAuthToken(),
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      };

      var $promise = $http.post('http://localhost:8080/LRService/v1/user-service/signup', data, config);

      //send ajax form submission
      $promise.then(function(data, status, headers, config) {
        $log.debug('Create User Info + ' + JSON.stringify(data));

        var result = data.data;
        if(result.code !== 1) {
          //some error
          d.reject(ret);
          return;
        }

        /*Update all user info*/
        _updateUserInfo(result.user);

        //Clear usrList cache, so search will pull from db
        cache.removeAll();
        d.resolve(user);        

      }, function(r) {
        $log.debug('Error Info while creating new user + ' + JSON.stringify(r.data));
        ret = _parseErrorResponse(r.data);
        d.reject(ret);
      });
      //always return deferred object
      return d.promise;
    }

    var _getUserList = function(handleSuccess, handleError) {      
      var searchData = cache.get('userSearchData');
      if(searchData) {
        $log.debug("Got user list from cache");
        handleSuccess(searchData);
        return;
      }

      $http({
        method: 'GET',
        url:'http://localhost:8080/LRService/v1/user-service/listuser',
        headers: {
          'service_key': '824bb1e8-de0c-401c-9f83-8b1d18a0ca9d',
          'auth_token' : userService.getAuthToken(),
          'Content-Type': 'application/x-www-form-urlencoded'
        }

      }).success(function (data, status){
        $log.debug("Got user list from db");
        var processedData = data.users; //may be we can use a process function
        cache.put('userSearchData', processedData);
        handleSuccess(processedData);

      }).error(function (data, status){
        handleError(data);
      });

    };

    function _editUser(userData) {
      $log.debug("edit user service" + JSON.stringify(userData));
      
      var id        = userData.id;
      var firstName = userData.firstName;
      var lastName  = userData.lastName;
      var password  = userData.password;      
      var email     = userData.email;
      var mobile    = userData.mobile;
      var role      = userData.role;

      var ret = _defResult, d = $q.defer();

      //input validation 
      if(!password.length) {
        ret.msg = 'Invalid input!';
        d.reject(ret);
      }
      
      var data = 'userId=' + id +
                 '&firstName=' + firstName +
                 '&lastName=' + lastName +
                 '&password=' +  encodeURIComponent(password) +
                 '&email=' + email +
                 '&mobile=' + mobile +
                 '&role=' + role;

      var config = { 
        headers: {
          'service_key': '824bb1e8-de0c-401c-9f83-8b1d18a0ca9d',
          'auth_token' : userService.getAuthToken(),
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      };

      var $promise = $http.post('http://localhost:8080/LRService/v1/user-service/edituser', data, config);

      //send ajax form submission
      $promise.then(function(data, status, headers, config) {
        $log.debug('Updated User Info + ' + JSON.stringify(data));

        var result = data.data;
        if(result.code !== 1) {
          //some error
          d.reject(ret);
          return;
        }

        /*Update all user info*/
        _updateUserInfo(result.user);

        //Clear usrList cache, so search will pull from db
        cache.removeAll();
        d.resolve(user);        

      }, function(r) {
        $log.debug('Error Info while updating user + ' + JSON.stringify(r.data));
        ret = _parseErrorResponse(r.data);
        d.reject(ret);
      });
      //always return deferred object
      return d.promise;
    }

    return {      
      getUser: function() {return user;},
      createUser: _createUser,
      editUser: _editUser,
      getUserList: _getUserList

    };

  }]);
