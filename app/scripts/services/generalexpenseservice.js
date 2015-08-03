'use strict';

/**
 * @ngdoc service
 * @name lrwebApp.userservice
 * @description
 * # userservice
 * Service in the lrwebApp.
 */
angular.module('lrwebApp')
  .service('generalExpenseService', ['$rootScope', '$cacheFactory', 'userService', '$http', '$q', '$log', '$timeout',
  function ($rootScope, $cacheFactory, userService, $http, $q, $log, $timeout) {

  var _defResult = {
          'sts' : false,
          'code': 0,
          'msg': 'Unexpected error'
        };

  var cache = $cacheFactory('accountsList')

  function _parseErrorResponse(o) {
      //parse error response and return in expected format
      var ret = _defResult, err = {};

      if(angular.isUndefined(o) || o === null) {
        return ret;
      }    

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

    function _newExpense(expense) {
      $log.debug(expense)
      
      //normalize input
      var amount        = expense.amount || '';
      var accountId     = expense.accountId;
      var date          = expense.date
      var status        = 'Open'; //Status should be open while creating
      var remark        = expense.remark;
      

      var ret = _defResult, d = $q.defer();

      //var pattern = /(\d{2})\-(\d{2})\-(\d{4})/;      
      if(date && date.length) {
        //var tmpdate = new Date(date.replace(pattern,'$3-$2-$1'));
        var tmpdate = new Date(date)
        if (isNaN(tmpdate.valueOf())) {          
          ret.msg = 'Date is not valid';
          d.reject(ret);
          return d.promise;
        }
      }

      //input validation     
      if(!amount.length || !accountId) {
        ret.msg = 'Invalid input!';
         d.reject(ret);
        return d.promise;
      }



      //set progress
      /*
      $timeout(function() {
        d.notify('Creating expenses..');
      }, 0);
      */           

      var data = 'amount='       + amount      + 
                 '&accountId='   + accountId   +
                 '&date='        + date        +
                 '&status='      + status      +
                 '&remark='      + remark ;

      var config = { 
        headers: {
          'service_key': '824bb1e8-de0c-401c-9f83-8b1d18a0ca9d',
          'auth_token' :  userService.getAuthToken(),
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      };
      var $promise = $http.post('http://localhost:8080/LRService/v1/general-expense/newexpense', data, config);

      //send ajax form submission
      $promise.then(function(data, status, headers, config) {
        $log.debug('New expense Info + ' + JSON.stringify(data));

        var result = data.data;
        if(result.code !== 1) {
          //some error
          d.reject(ret);
          return;
        }
        //to-do update default object
        d.resolve(result.expense);
      }, function(r) {
        $log.debug('Error while creating new expense + ' + JSON.stringify(r.data));
        ret = _parseErrorResponse(r.data);
        d.reject(ret);
      });
      //always return deferred object
      return d.promise;
    };

    function _editExpense(expense) {
      console.log(expense);
      //normalize input
      var id        = expense.id;
      var amount    = expense.amount || '';
      var accountId = expense.account.id;
      var date      = expense.date;
      var status    = expense.status || '';
      var remark    = expense.remark;      

      var ret = _defResult, d = $q.defer();

      if(date && date.length) {
        var tmpdate = new Date(date)
        if (isNaN(tmpdate.valueOf())) {          
          ret.msg = 'Date is not valid';
          d.reject(ret);
          return d.promise;
        }
      }

      //input validation     
      if(!accountId || !status.length) {
        ret.msg = 'Invalid input!';
        d.reject(ret);
        return d.promise;
      }

      //set progress
      /*
      $timeout(function() {
        d.notify('Creating expenses..');
      }, 0);
      */           

      var data = 'id='         + id        + 
                 '&amount='    + amount    + 
                 '&accountId=' + accountId +
                 '&date='      + date      +
                 '&status='    + status    +
                 '&remark='    + remark ;

      var config = { 
        headers: {
          'service_key': '824bb1e8-de0c-401c-9f83-8b1d18a0ca9d',
          'auth_token' :  userService.getAuthToken(),
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      };
      var $promise = $http.post('http://localhost:8080/LRService/v1/general-expense/editexpense', data, config);

      //send ajax form submission
      $promise.then(function(data, status, headers, config) {
        console.log(data);
        $log.debug('edit expense Info + ' + JSON.stringify(data));

        var result = data.data;
        if(result.code !== 1) {
          //some error
          d.reject(ret);
          return;
        }
        d.resolve(result.expense);
      }, function(r) {
        $log.debug('Error while editing expense + ' + JSON.stringify(r.data));
        ret = _parseErrorResponse(r.data);
        d.reject(ret);
      });
      
      return d.promise;
    }


    var _getAccountList = function(handleSuccess, handleError) {      
      var accountsListData = cache.get('accountsList');
      if(accountsListData) {
        $log.debug("Got account list from cache");
        handleSuccess(accountsListData);
        return;
      }

      $http({
        method: 'GET',
        url:'http://localhost:8080/LRService/v1/account/list',
        headers: {
          'service_key': '824bb1e8-de0c-401c-9f83-8b1d18a0ca9d',
          'auth_token' : userService.getAuthToken(),
          'Content-Type': 'application/x-www-form-urlencoded'
        }

      }).success(function (data, status){
        $log.debug("Got account list from db");        
        var processedData = data.accounts; //may be we can use a process function
        cache.put('accountsListData', processedData);
        handleSuccess(processedData);

      }).error(function (data, status){
        handleError(data);
      });

    };

    function _listExpense(search) {      
      //normalize input
      var accountId = '';
      var frmdate   = '';
      var todate    = '';
      var status    = '';

      if(search) {
        if(search.accountid) {
          accountId = search.accountid;
        }
        if(search.fromdate) {
          frmdate = search.fromdate;  
        }
        if(search.todate) {
          todate = search.todate;  
        }
        if(search.status) {
          status = search.status;
        }
      }
      console.log(frmdate);

      var ret = _defResult, d = $q.defer();

      //input validation. To-do : This should be done in frontend.
      var pattern = /(\d{2})\-(\d{2})\-(\d{4})/;
      var fdate   = null;
      var tdate   = null;

      if(frmdate && frmdate.length > 0) {
        fdate = new Date(frmdate.replace(pattern,'$3-$2-$1'));
        if (isNaN(fdate.valueOf())) {
          console.log('From date is not valid');
          ret.msg = 'From date is not valid';
          d.reject(ret);
          return d.promise;
        }
      }

      if(todate && todate.length > 0) {
        tdate = new Date(todate.replace(pattern,'$3-$2-$1'));
        if (isNaN(tdate.valueOf())) {
          console.log('To date is not valid');
          ret.msg = 'To date is not valid';
          d.reject(ret);
          return d.promise;
        }
      }

      if(fdate && tdate) {                
        $log.debug(fdate,tdate);
        if(fdate > tdate) {
          ret.msg = 'From date should not be greater than to date';
          d.reject(ret);
          return d.promise;  
        }
        
        var millisecondsPerDay = 1000 * 60 * 60 * 24;
        console.log((tdate - fdate) / millisecondsPerDay);
        if(((tdate - fdate) / millisecondsPerDay) > 30) {
          console.log('Difference between from and to should not be more than 30 days');
          ret.msg = 'Difference between from and to should not be more than 30 days';
          d.reject(ret);
          return d.promise;  
        }
        
      }

      var data = 'accountId=' + accountId +
                 '&fromDate=' + frmdate   +
                 '&toDate='   + todate    +
                 '&status='   + status;
      console.log(data);

      var config = { 
        headers: {
          'service_key': '824bb1e8-de0c-401c-9f83-8b1d18a0ca9d',
          'auth_token' :  userService.getAuthToken(),
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      };

      var $promise = $http.post('http://localhost:8080/LRService/v1/general-expense/list', data, config);

      //send ajax form submission
      $promise.then(function(data, status, headers, config) {
        $log.debug('List expense Data + ' + JSON.stringify(data));

        var result = data.data;

        $log.debug(result);
        //$log.debug(result.code);

        /* (Not getting the code)
        if(result.code !== 1) {
          //some error
          d.reject(ret);
          return;
        }*/
        
        d.resolve(result.expenses);      

      }, function(r) {
        $log.debug('List expense Error Info + ' + JSON.stringify(r.data));
        ret = _parseErrorResponse(r.data);
        d.reject(ret);
      });
      
      return d.promise;

    };

    return {      
      newExpense: _newExpense,
      editExpense: _editExpense,
      getAccountList: _getAccountList,
      listExpense: _listExpense
    };

  }]);
