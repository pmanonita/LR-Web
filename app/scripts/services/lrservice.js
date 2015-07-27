'use strict';

/**
 * @ngdoc service
 * @name lrwebApp.userservice
 * @description
 * # userservice
 * Service in the lrwebApp.
 */
angular.module('lrwebApp')
  .service('lrService', ['$rootScope', '$http', '$q', '$log','$cacheFactory','userService', function ($rootScope, $http, $q, $log,$cacheFactory,userService) {
    // AngularJS will instantiate a singleton by calling "new" on this function

   var _defResult = {
          'sts' : false,
          'code': 0,
          'msg': 'Unexpected error.'
        };

        
    var lr = {};
    var cache = $cacheFactory('consignerSearchData')
   
  


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

     function _updateLRInfo(LR) {
      console.log("updaing lr details after creating in successful");
      
      lr.lrNo = LR.id;
      lr.vehicleNo = LR.vehicleNo;
      lr.vehicleOwner = LR.vehicleOwner;
      lr.consigner = LR.consigner;
      lr.consignee = LR.consignee;     
      lr.billingParty = LR.billingParty;    

      
    }

     function _updateLRExpenditureInfo(LR) {
      console.log("updaing lr details after creating in successful");
      
      //lr.lrNo = LR.lrNo;
      lr.freightToBroker = LR.freightToBroker;
      lr.extraPayToBroker = LR.extraPayToBroker;
      lr.advance = LR.advance;
      lr.balanceFreight = LR.balanceFreight;
      lr.loadingCharges = LR.loadingCharges;
      lr.unloadingCharges = LR.unloadingCharges;
      lr.loadingDetBroker = LR.loadingDetBroker;   
      lr.unloadingDetBroker = LR.unloadingDetBroker;   

 

      
    }

    function _updateLRIncomeInfo(LR) {
      console.log("updaing lr details after creating in successful");
      
      //lr.lrNo = LR.lrNo;
      lr.freightToBrokerBilling = LR.freightToBroker;
      lr.extraPayToBrokerBilling = LR.extraPayToBroker;
      lr.loadingChargesBilling = LR.loadingCharges;
      lr.unloadingChargesBilling = LR.unloadingCharges;
      lr.loadingDetBrokerBilling = LR.loadingDetBroker;   
      lr.unloadingDetBrokerBilling = LR.unloadingDetBroker;   

 

      
    }

     function _updateLROtherExpenditureInfo(LR) {
      console.log("updaing lr other expenditure details after creating in successful"+lr.otherAmount);
      
      //lr.lrNo = LR.lrNo;
      lr.otherAmount = LR.amount;
      lr.otherRemarks = LR.remarks;
      
    }
  

    function _createLR(lrData) {
      console.log("at createlr")
      
      //normalize input
      
      var vehileNo = lrData.vehicleNo || '';
      var vehicleOwner = lrData.vehicleOwner || '';
      var consignerId =  '';
      var consigneeId =  '';      
      var billingParty = lrData.billingParty || '';

      if(angular.isObject(lrData.consigner)){
        consignerId = lrData.consigner.id || '';
      }

       if(angular.isObject(lrData.consignee)){
        consigneeId = lrData.consignee.id || '';  
      }

           

      var ret = _defResult, d = $q.defer();

     

      //set progress
      d.notify('Creating lr');
      
      var data = 'vehileNo=' +  vehileNo +
                 '&vehicleOwner=' + vehicleOwner +
                 '&consignerId=' + consignerId +
                 '&consigneeId=' + consigneeId +                
                 '&billingParty=' + billingParty ;


      console.log(data);

      var config = { 
        headers: {
          'service_key': '824bb1e8-de0c-401c-9f83-8b1d18a0ca9d',
          'auth_token' :  userService.getAuthToken(),
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      };

      var $promise = $http.post('http://localhost:8080/LRService/v1/lr-service/newlr', data, config);

      //send ajax form submission
      $promise.then(function(data, status, headers, config) {
        $log.debug('LR Info + ' + JSON.stringify(data));

        var result = data.data; // Fix it

        $log.debug(result);
        $log.debug(result.code);

        if(result.code !== 1) {
          //some error
          d.reject(ret);
          return;
        }

        
        /*Update all user info*/
        _updateLRInfo(result.lr);
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

    function _createExpenditure(lrData) {
      console.log("at createexpenditure")
      //normalize input
      
      var lrNo = lrData.lrNo || '';
      var freightToBroker = lrData.freightToBroker || '';
      var extraPayToBroker = lrData.extraPayToBroker || '';
      var advance = lrData.advance || '';
      var balanceFreight = lrData.balanceFreight || '';
      var loadingCharges = lrData.loadingCharges || '';     
      var unloadingCharges = lrData.unloadingCharges || '';
      var loadingDetBroker = lrData.loadingDetBroker || '';
      var unloadingDetBroker = lrData.unloadingDetBroker || '';

      

      var ret = _defResult, d = $q.defer();

     

      //set progress
      d.notify('Creating lr');
      
      var data = 'lrNo=' +  lrNo +
                 '&freightToBroker=' + freightToBroker +
                 '&extraPayToBroker=' + extraPayToBroker +
                 '&advance=' + advance +
                 '&balanceFreight=' + balanceFreight +
                 '&loadingCharges=' + loadingCharges +
                 '&unloadingCharges=' + unloadingCharges +
                 '&loadingDetBroker=' + loadingDetBroker +
                 '&unloadingDetBroker=' + unloadingDetBroker ;


      console.log(data);

      var config = { 
        headers: {
          'service_key': '824bb1e8-de0c-401c-9f83-8b1d18a0ca9d',
          'auth_token' :  userService.getAuthToken(),
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      };

      var $promise = $http.post('http://localhost:8080/LRService/v1/lr-service/addlrexpenditure', data, config);

      //send ajax form submission
      $promise.then(function(data, status, headers, config) {
        $log.debug('LR Info + ' + JSON.stringify(data));

        var result = data.data; // Fix it

        $log.debug(result);
        $log.debug(result.code);

        if(result.code !== 1) {
          //some error
          d.reject(ret);
          return;
        }

        
        /*Update all user info*/
        _updateLRExpenditureInfo(result.lrExpenditure);
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

    function _createIncome(lrData) {
      console.log("at createincome")
      //normalize input
      
      var lrNo = lrData.lrNo || '';
      var freightToBrokerBilling = lrData.freightToBrokerBilling || '';
      var extraPayToBrokerBilling = lrData.extraPayToBrokerBilling || '';      
      var loadingChargesBilling = lrData.loadingChargesBilling || '';     
      var unloadingChargesBilling = lrData.unloadingChargesBilling || '';
      var loadingDetBrokerBilling = lrData.loadingDetBrokerBilling || '';
      var unloadingDetBrokerBilling= lrData.unloadingDetBrokerBilling || '';

      

      var ret = _defResult, d = $q.defer();

     

      //set progress
      d.notify('Creating income');
      
      var data = 'lrNo=' +  lrNo +
                 '&freightToBrokerBilling=' + freightToBrokerBilling +
                 '&extraPayToBrokerBilling=' + extraPayToBrokerBilling +                 
                 '&loadingChargesBilling=' + loadingChargesBilling +
                 '&unloadingChargesBilling=' + unloadingChargesBilling +
                 '&loadingDetBrokerBilling=' + loadingDetBrokerBilling +
                 '&unloadingDetBrokerBilling=' + unloadingDetBrokerBilling ;


      console.log(data);

      var config = { 
        headers: {
          'service_key': '824bb1e8-de0c-401c-9f83-8b1d18a0ca9d',
          'auth_token' :  userService.getAuthToken(),
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      };

      var $promise = $http.post('http://localhost:8080/LRService/v1/lr-service/addlrincome', data, config);

      //send ajax form submission
      $promise.then(function(data, status, headers, config) {
        $log.debug('LR Info + ' + JSON.stringify(data));

        var result = data.data; // Fix it

        $log.debug(result);
        $log.debug(result.code);

        if(result.code !== 1) {
          //some error
          d.reject(ret);
          return;
        }

        
        /*Update all user info*/
        _updateLRIncomeInfo(result.lrIncome);
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

     function _createOtherExpenditure(lrData) {
      console.log("at createotherexpenditure")
      //normalize input
      
      var lrNo = lrData.lrNo || '';
      var otherAmount = lrData.otherAmount || '';
      var otherRemarks = lrData.otherRemarks || '';
      

      
      

      var ret = _defResult, d = $q.defer();

     

      //set progress
      d.notify('Creating lr');
      
      var data = 'lrNo=' +  lrNo +
                 '&amount=' + otherAmount +
                 '&remarks=' + otherRemarks ;


      console.log(data);

      var config = { 
        headers: {
          'service_key': '824bb1e8-de0c-401c-9f83-8b1d18a0ca9d',
          'auth_token' :  userService.getAuthToken(),
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      };

      var $promise = $http.post('http://localhost:8080/LRService/v1/lr-service/addlrothers', data, config);

      //send ajax form submission
      $promise.then(function(data, status, headers, config) {
        $log.debug('LR Info + ' + JSON.stringify(data));

        var result = data.data; // Fix it

        $log.debug(result);
        $log.debug(result.code);

        if(result.code !== 1) {
          //some error
          d.reject(ret);
          return;
        }

        
        /*Update all user info*/
        _updateLROtherExpenditureInfo(result.lrOthers);
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

    function _updateLR(lrData) {
      console.log("at updatelr")
      
      //normalize input
      
      var lrNo = lrData.lrNo || '';
      var vehileNo = lrData.vehicleNo || '';
      var vehicleOwner = lrData.vehicleOwner || '';
      var consignerId =  '';
      var consigneeId =  '';      
      var billingParty = lrData.billingParty || '';

      if(angular.isObject(lrData.consigner)){
        consignerId = lrData.consigner.id || '';
      }

       if(angular.isObject(lrData.consignee)){
        consigneeId = lrData.consignee.id || '';  
      }

           

      var ret = _defResult, d = $q.defer();

     

      //set progress
      d.notify('Updating lr');
      
      var data =  'lrNo=' +  lrNo + 
                  'vehileNo=' +  vehileNo +
                 '&vehicleOwner=' + vehicleOwner +
                 '&consignerId=' + consignerId +
                 '&consigneeId=' + consigneeId +                
                 '&billingParty=' + billingParty ;


      console.log(data);

      var config = { 
        headers: {
          'service_key': '824bb1e8-de0c-401c-9f83-8b1d18a0ca9d',
          'auth_token' :  userService.getAuthToken(),
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      };

      var $promise = $http.post('http://localhost:8080/LRService/v1/lr-service/updatelr', data, config);

      //send ajax form submission
      $promise.then(function(data, status, headers, config) {
        $log.debug('LR Info + ' + JSON.stringify(data));

        var result = data.data; // Fix it

        $log.debug(result);
        $log.debug(result.code);

        if(result.code !== 1) {
          //some error
          d.reject(ret);
          return;
        }

        
        /*Update all user info*/
        _updateLRInfo(result.lr);
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

    var _getConsignerList = function(handleConsignerSuccess, handleConsignerError) {      
      var searchData = cache.get('consignerSearchData');
      if(searchData) {
        $log.debug("Got consigner list from cache");
        handleConsignerSuccess(searchData);
        return;
      }

      $http({
        method: 'GET',
        url:'http://localhost:8080/LRService/v1/listconsinors',
        headers: {
          'service_key': '824bb1e8-de0c-401c-9f83-8b1d18a0ca9d',
          'auth_token' : userService.getAuthToken(),
          'Content-Type': 'application/x-www-form-urlencoded'
        }

      }).success(function (data, status){
        $log.debug("Got consigner list from db");
        var processedData = data.consigners; //may be we can use a process function
        console.log("consigner data"+JSON.stringify(processedData));
        cache.put('consignerSearchData', processedData);
        handleConsignerSuccess(processedData);

      }).error(function (data, status){
        handleError(data);
      });

    };

    var _getConsigneeList = function(handleConsigneeSuccess, handleConsigneeError) {      
      var searchData = cache.get('consigneeSearchData');
      if(searchData) {
        $log.debug("Got consignee list from cache");
        handleConsigneeSuccess(searchData);
        return;
      }

      $http({
        method: 'GET',
        url:'http://localhost:8080/LRService/v1/listconsinees',
        headers: {
          'service_key': '824bb1e8-de0c-401c-9f83-8b1d18a0ca9d',
          'auth_token' : userService.getAuthToken(),
          'Content-Type': 'application/x-www-form-urlencoded'
        }

      }).success(function (data, status){
        $log.debug("Got consignee list from db");
        var processedData = data.consignees; //may be we can use a process function
        console.log("consignee data"+JSON.stringify(processedData));
        cache.put('consigneeSearchData', processedData);
        handleConsigneeSuccess(processedData);

      }).error(function (data, status){
        handleConsigneeError(data);
      });

    };


    return { 
      createLR: _createLR,
      createExpenditure: _createExpenditure,
      createOtherExpenditure: _createOtherExpenditure,
      updateLR:_updateLR,
      createIncome:_createIncome,
      getConsignerList: _getConsignerList,
      getConsigneeList: _getConsigneeList,
      getLR: function() {return lr;}
    };

  }]);
