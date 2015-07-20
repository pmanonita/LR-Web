'use strict';

/**
 * @ngdoc service
 * @name lrwebApp.userservice
 * @description
 * # userservice
 * Service in the lrwebApp.
 */
angular.module('lrwebApp')
  .service('lrService', ['$rootScope', '$http', '$q', '$log', function ($rootScope, $http, $q, $log) {
    // AngularJS will instantiate a singleton by calling "new" on this function

   var _defResult = {
          'sts' : false,
          'code': 0,
          'msg': 'Unexpected error.'
        };

        
    var lr = {};
   
	


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
      lr.vehileNo = LR.vehileNo;
      lr.vehicleOwner = LR.vehicleOwner;
      lr.consignor = LR.consignor;
      lr.consignee = LR.consignee;
      lr.servTaxConsigner = LR.servTaxConsigner
      lr.servTaxConsignee = LR.servTaxConsignee
      lr.billingParty = LR.billingParty;    

      
    }

     function _updateLRExpenditureInfo(LR) {
      console.log("updaing lr details after creating in successful");
      
      lr.lrNo = LR.lrNo;
      lr.freightToBroker = LR.freightToBroker;
      lr.extraPayToBroker = LR.extraPayToBroker;
      lr.advance = LR.advance;
      lr.balanceFreight = LR.balanceFreight;
      lr.loadingCharges = LR.loadingCharges;
      lr.unloadingCharges = LR.unloadingCharges;
      lr.loadingDetBroker = LR.loadingDetBroker;   
      lr.unloadingDetBroker = LR.unloadingDetBroker;   

 

      
    }
  

    function _createLR(lrData,authKey) {
      console.log("at createlr")
      //normalize input
      
      var vehileNo = lrData.vehicleNo || '';
      var vehicleOwner = lrData.vehicleOwner || '';
      var consignor = lrData.consignor || '';
      var consignee = lrData.consignee || '';
      var servTaxConsigner = lrData.servTaxConsigner || '';     
      var servTaxConsignee = lrData.servTaxConsignee || '';
      var billingParty = lrData.billingParty || '';

      console.log("auth token "+authKey);
      

      var ret = _defResult, d = $q.defer();

     

      //set progress
      d.notify('Creating lr');
      
      var data = 'vehileNo=' +  vehileNo +
                 '&vehicleOwner=' + vehicleOwner +
                 '&consignor=' + consignor +
                 '&consignee=' + consignee +
                 '&servTaxConsigner=' + servTaxConsigner +
                 '&servTaxConsignee=' + servTaxConsignee +
                 '&billingParty=' + billingParty ;


      console.log(data);

      var config = { 
        headers: {
          'service_key': '824bb1e8-de0c-401c-9f83-8b1d18a0ca9d',
          'auth_token' :  authKey,
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

    function _createExpenditure(lrData,authKey) {
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

      console.log("auth token "+authKey);
      

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
          'auth_token' :  authKey,
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
        _updateLRExpenditureInfo(result.lr);
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
      createLR: _createLR,
      createExpenditure: _createExpenditure,
      getLR: function() {return lr;}
    };

  }]);
