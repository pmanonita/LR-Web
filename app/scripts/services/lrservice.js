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

    function _updateLRInfo(LR) {
      console.log("updaing lr details after creating in successful");
      
      lr.lrNo         = LR.id;
      lr.transNo      = LR.transid;
      lr.vehicleNo    = LR.vehicleNo;
      lr.vehicleOwner = LR.vehicleOwner;
      lr.consigner    = LR.consigner;
      lr.consignee    = LR.consignee;     
      lr.billingParty = LR.billingParty;    
      lr.lrDate       = LR.lrDate;
      lr.poNo         = LR.poNo;
      lr.doNo         = LR.doNo;
      lr.billingname  = LR.billingname;
      lr.multiLoad    = LR.multiLoad;

      
    }

    function _updateLRExpenditureInfo(LR) {

      lr.freightToBroker    = LR.freightToBroker;
      lr.extraPayToBroker   = LR.extraPayToBroker;
      lr.advance            = LR.advance;
      lr.balanceFreight     = LR.balanceFreight;
      lr.loadingCharges     = LR.loadingCharges;
      lr.unloadingCharges   = LR.unloadingCharges;
      lr.loadingDetBroker   = LR.loadingDetBroker;   
      lr.unloadingDetBroker = LR.unloadingDetBroker;      
    }

    function _updateLRIncomeInfo(LR) {      

      lr.freightToBrokerBilling    = LR.freightToBroker;
      lr.extraPayToBrokerBilling   = LR.extraPayToBroker;
      lr.loadingChargesBilling     = LR.loadingCharges;
      lr.unloadingChargesBilling   = LR.unloadingCharges;
      lr.loadingDetBrokerBilling   = LR.loadingDetBroker;   
      lr.unloadingDetBrokerBilling = LR.unloadingDetBroker;       
    }

    function _updateLROtherExpenditureList(LROtherExpenditure) {      

      lr.otherExpenditures  = LROtherExpenditure;      
    }

     function _updateLROtherIncomeList(LROtherIncome) {      

      lr.otherIncomes  = LROtherIncome;      
    }


     function _updateLRList(LRList) {      

      lr.LRList  = LRList;      
    }

    function _updateLRChalanDetails(LRChalan) {      

      lr.chalan  = LRChalan; 
      lr.chalan.chalanDetails  =  JSON.parse(LRChalan.chalanDetails);   
    }

    function _updateLRBillDetails(LRBill) {      

      lr.bill  = LRBill; 
      lr.bill.billDetails =   JSON.parse(LRBill.billDetails);     
    }

  

    function _createLR(lrData) {
      console.log("at createlr")
      
      //normalize input      
      var vehileNo     = lrData.vehicleNo || '';
      var vehicleOwner = lrData.vehicleOwner || '';
      var consignerId  =  '';
      var consigneeId  =  '';      
      var billingParty = lrData.billingParty || '';
      var poNo         = lrData.poNo || '';
      var doNo         = lrData.doNo || '';
      var billignameId = '';
      var multiLoad      = lrData.multiLoad || '';


      if(angular.isObject(lrData.consigner)) {
        consignerId = lrData.consigner.id || '';
      }

      if(angular.isObject(lrData.consignee)) {
        consigneeId = lrData.consignee.id || '';  
      }

      if(angular.isObject(lrData.billingname)) {
        billignameId = lrData.billingname.id || '';  
      }            

      var ret = _defResult, d = $q.defer();    
    
      var data = 'vehileNo=' +  vehileNo +
                 '&vehicleOwner=' + vehicleOwner +
                 '&consignerId=' + consignerId +
                 '&consigneeId=' + consigneeId +                
                 '&billingParty=' + billingParty +
                 '&poNo='         + poNo +
                 '&doNo='         + doNo +
                 '&billingnameId=' + billignameId +
                 '&multiLoad='     + multiLoad +
                 '&userName='      + userService.getUser().name;

      console.log("data for create LR "+data);

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
        
        /*Update LR info*/
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
      var lrNo               = lrData.lrNo || '';
      var freightToBroker    = lrData.freightToBroker || '';
      var extraPayToBroker   = lrData.extraPayToBroker || '';
      var advance            = lrData.advance || '';
      var balanceFreight     = lrData.balanceFreight || '';
      var loadingCharges     = lrData.loadingCharges || '';     
      var unloadingCharges   = lrData.unloadingCharges || '';
      var loadingDetBroker   = lrData.loadingDetBroker || '';
      var unloadingDetBroker = lrData.unloadingDetBroker || '';
      
      var ret = _defResult, d = $q.defer();     
      
      var data = 'lrNo=' +  lrNo +
                 '&freightToBroker=' + freightToBroker +
                 '&extraPayToBroker=' + extraPayToBroker +
                 '&advance=' + advance +
                 '&balanceFreight=' + balanceFreight +
                 '&loadingCharges=' + loadingCharges +
                 '&unloadingCharges=' + unloadingCharges +
                 '&loadingDetBroker=' + loadingDetBroker +
                 '&unloadingDetBroker=' + unloadingDetBroker ;

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

        var result = data.data;

        $log.debug(result);
        $log.debug(result.code);

        if(result.code !== 1) {
          //some error
          d.reject(ret);
          return;
        }        
        
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
      
      var lrNo                      = lrData.lrNo || '';
      var freightToBrokerBilling    = lrData.freightToBrokerBilling || '';
      var extraPayToBrokerBilling   = lrData.extraPayToBrokerBilling || '';      
      var loadingChargesBilling     = lrData.loadingChargesBilling || '';     
      var unloadingChargesBilling   = lrData.unloadingChargesBilling || '';
      var loadingDetBrokerBilling   = lrData.loadingDetBrokerBilling || '';
      var unloadingDetBrokerBilling = lrData.unloadingDetBrokerBilling || '';
      

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
      
      var lrNo         = lrData.lrNo || '';
      var otherAmount  = lrData.otherAmount || '';
      var otherRemarks = lrData.otherRemarks || '';
    
      var ret = _defResult, d = $q.defer();
      
      var data = 'lrNo=' +  lrNo +
                 '&amount=' + otherAmount +
                 '&remarks=' + otherRemarks ;

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

        _updateLROtherExpenditureList(result.lrOthers);
        ret.sts = true;
        d.resolve(ret);      

      }, function(r) {
        $log.debug('Error Info + ' + JSON.stringify(r.data));
        ret = _parseErrorResponse(r.data);
        d.reject(ret);
      });
      
      return d.promise;
    }

    function _removeOtherExpenditure(lrOtherExpenditureId,lrNo) {
      console.log("at removeotherexpenditure")
      //normalize input
      
      
    
      var ret = _defResult, d = $q.defer();
      
      var data = 'lrOtherExpenditureId=' +  lrOtherExpenditureId +
                 '&lrNo=' + lrNo;

      var config = { 
        headers: {
          'service_key': '824bb1e8-de0c-401c-9f83-8b1d18a0ca9d',
          'auth_token' :  userService.getAuthToken(),
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      };

      var $promise = $http.post('http://localhost:8080/LRService/v1/lr-service/removelrothers', data, config);

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

        _updateLROtherExpenditureList(result.lrOthers);
        ret.sts = true;
        d.resolve(ret);      

      }, function(r) {
        $log.debug('Error Info + ' + JSON.stringify(r.data));
        ret = _parseErrorResponse(r.data);
        d.reject(ret);
      });
      
      return d.promise;
    }

    function _createOtherIncome(lrData) {
      console.log("at createotherincome")
      //normalize input
      
      var lrNo         = lrData.lrNo || '';
      var otherAmount  = lrData.otherAmountBilling || '';
      var otherRemarks = lrData.otherRemarksBilling || '';
    
      var ret = _defResult, d = $q.defer();
      
      var data = 'lrNo=' +  lrNo +
                 '&amount=' + otherAmount +
                 '&remarks=' + otherRemarks ;

      var config = { 
        headers: {
          'service_key': '824bb1e8-de0c-401c-9f83-8b1d18a0ca9d',
          'auth_token' :  userService.getAuthToken(),
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      };

      var $promise = $http.post('http://localhost:8080/LRService/v1/lr-service/addlrotherincome', data, config);

      //send ajax form submission
      $promise.then(function(data, status, headers, config) {
        $log.debug('LRIncome Info + ' + JSON.stringify(data));

        var result = data.data; // Fix it

        $log.debug(result.lrOtherIncome);
        $log.debug(result.code);

        if(result.code !== 1) {
          //some error
          d.reject(ret);
          return;
        }     

        _updateLROtherIncomeList(result.lrOtherIncome);
        ret.sts = true;
        d.resolve(ret);      

      }, function(r) {
        $log.debug('Error Info + ' + JSON.stringify(r.data));
        ret = _parseErrorResponse(r.data);
        d.reject(ret);
      });
      
      return d.promise;
    }

    function _removeOtherIncome(lrOtherIncomeId,lrNo) {
      console.log("at removeotherincome")
      //normalize input
      
      
    
      var ret = _defResult, d = $q.defer();
      
      var data = 'lrOtherIncomeId=' +  lrOtherIncomeId +
                 '&lrNo=' + lrNo;

      var config = { 
        headers: {
          'service_key': '824bb1e8-de0c-401c-9f83-8b1d18a0ca9d',
          'auth_token' :  userService.getAuthToken(),
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      };

      var $promise = $http.post('http://localhost:8080/LRService/v1/lr-service/removelrotherincome', data, config);

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

        _updateLROtherIncomeList(result.lrOtherIncome);
        ret.sts = true;
        d.resolve(ret);      

      }, function(r) {
        $log.debug('Error Info + ' + JSON.stringify(r.data));
        ret = _parseErrorResponse(r.data);
        d.reject(ret);
      });
      
      return d.promise;
    }

    function _getLRByDate(lrDate) {
      console.log("at getLRByDate")
      //normalize input
      
      
    
      var ret = _defResult, d = $q.defer();
      
      var data = 'lrDate=' +  lrDate;

      var config = { 
        headers: {
          'service_key': '824bb1e8-de0c-401c-9f83-8b1d18a0ca9d',
          'auth_token' :  userService.getAuthToken(),
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      };

      var $promise = $http.post('http://localhost:8080/LRService/v1/lr-service/getLRByDate', data, config);

      //send ajax form submission
      $promise.then(function(data, status, headers, config) {
        $log.debug('LR Info + ' + JSON.stringify(data));

        var result = data.data; // Fix it

        $log.debug(result);
        $log.debug(result.code);

        //if(result.code !== 1) {
          //some error
         // d.reject(ret);
//return;
       // }     

        _updateLRList(result.lrs);
        ret.sts = true;
        d.resolve(ret);      

      }, function(r) {
        $log.debug('Error Info + ' + JSON.stringify(r.data));
        ret = _parseErrorResponse(r.data);
        d.reject(ret);
      });
      
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
      var poNo         = lrData.poNo || '';
      var doNo         = lrData.doNo || '';
      var billingnameId =  ''; 
      var multiLoad     = lrData.multiLoad || ''; 

      if(angular.isObject(lrData.consigner)){
        consignerId = lrData.consigner.id || '';
      }

       if(angular.isObject(lrData.consignee)){
        consigneeId = lrData.consignee.id || '';  
      }

      if(angular.isObject(lrData.billingname)){
        billingnameId = lrData.billingname.id || '';  
      }             

      var ret = _defResult, d = $q.defer();
     
      var data = 'lrNo=' +  lrNo + 
                 '&vehileNo=' +  vehileNo +
                 '&vehicleOwner=' + vehicleOwner +
                 '&consignerId=' + consignerId +
                 '&consigneeId=' + consigneeId +                
                 '&billingParty=' + billingParty +
                 '&poNo='         + poNo +
                 '&doNo='         + doNo +
                 '&billingnameId='+ billingnameId +
                 '&multiLoad='    + multiLoad;
 
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

    var _getBillingnameList = function(handleBillingnameSuccess, handleBillingnameError) {      
      var searchData = cache.get('billingnameearchData');
      if(searchData) {
        $log.debug("Got billingname list from cache");
        handleBillingnameSuccess(searchData);
        return;
      }

      $http({
        method: 'GET',
        url:'http://localhost:8080/LRService/v1/listbillingnames',
        headers: {
          'service_key': '824bb1e8-de0c-401c-9f83-8b1d18a0ca9d',
          'auth_token' : userService.getAuthToken(),
          'Content-Type': 'application/x-www-form-urlencoded'
        }

      }).success(function (data, status){
        $log.debug("Got billigname list from db");
        var processedData = data.billingnames; //may be we can use a process function
        console.log("billingname data"+JSON.stringify(processedData));
        cache.put('billingnameSearchData', processedData);
        handleBillingnameSuccess(processedData);

      }).error(function (data, status){
        handleBillingnameError(data);
      });

    };

    function _searchLR(lrData) {
      $log.debug("SearchLR : " + lrData.lrNo)
      
      //normalize input      
      var lrNo = lrData.lrNo || '';      
      var ret = _defResult, d = $q.defer();
      
       //input validation 
      if(!lrNo.length) {
        ret.msg = 'Invalid input!';
        d.reject(ret);
      }

      var data = 'lrNo=' +  lrNo

      var config = { 
        headers: {
          'service_key': '824bb1e8-de0c-401c-9f83-8b1d18a0ca9d',
          'auth_token' :  userService.getAuthToken(),
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      };

      var $promise = $http.post('http://localhost:8080/LRService/v1/lr-service/searchlr', data, config);

      //send ajax form submission
      $promise.then(function(data, status, headers, config) {
        $log.debug('Searched LR Data + ' + JSON.stringify(data));

        var result = data.data;

        $log.debug(result);
        $log.debug(result.code);

        if(result.code !== 1) {
          //some error
          d.reject(ret);
          return;
        }  

        console.log("expenditureis"+result.lrExpenditure) ; 

        if(!angular.isUndefined(result.lr) && result.lr != null) { _updateLRInfo(result.lr); }
        if(!angular.isUndefined(result.lrExpenditure) && result.lrExpenditure != null) { _updateLRExpenditureInfo(result.lrExpenditure); }
        if(!angular.isUndefined(result.lrOthers) && result.lrOthers != null ) {  _updateLROtherExpenditureList(result.lrOthers); }
       
        if(!angular.isUndefined(result.lrIncome) && result.lrIncome != null) {  _updateLRIncomeInfo(result.lrIncome); }
        if(!angular.isUndefined(result.lrOtherIncome) && result.lrOtherIncome != null) {  _updateLROtherIncomeList(result.lrOtherIncome); }
        if(!angular.isUndefined(result.lrChalan) && result.lrChalan != null) {  _updateLRChalanDetails(result.lrChalan); }
        if(!angular.isUndefined(result.lrBill) && result.lrBill != null) {  _updateLRBillDetails(result.lrBill); }
        


        ret.sts = true;
        d.resolve(ret);      

      }, function(r) {
        $log.debug('Error Info + ' + JSON.stringify(r.data));
        ret = _parseErrorResponse(r.data);
        d.reject(ret);
      });
      
      return d.promise;

    };

    function _createChalan(lrNos,expenditureColumn,otherExpenditureColumn) {
      console.log("at createChalan")
      //normalize input
      var columns = expenditureColumn;
      if(!angular.isUndefined(otherExpenditureColumn) && otherExpenditureColumn != null) {
        columns = columns.concat(otherExpenditureColumn);
      }
      
      var jsonData=angular.toJson(columns);    
      
    
      var ret = _defResult, d = $q.defer();

      var data = 'lrNos=' +  lrNos +
                 '&chalanDetails='  + jsonData;
      console.log(" data for createdata "+data);
      
      

      var config = { 
        headers: {
          'service_key': '824bb1e8-de0c-401c-9f83-8b1d18a0ca9d',
          'auth_token' :  userService.getAuthToken(),
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      };

      var $promise = $http.post('http://localhost:8080/LRService/v1/lr-service/createChalan', data, config);

      //send ajax form submission
      $promise.then(function(data, status, headers, config) {
        $log.debug('LRChalan Info + ' + JSON.stringify(data));

        var result = data.data; // Fix it

        $log.debug(result);
        $log.debug(result.code);

        if(result.code !== 1) {
          //some error
          d.reject(ret);
          return;
        }     

        _updateLRChalanDetails(result.lrChalan);
        ret.sts = true;
        d.resolve(ret);      

      }, function(r) {
        $log.debug('Error Info + ' + JSON.stringify(r.data));
        ret = _parseErrorResponse(r.data);
        d.reject(ret);
      });
      
      return d.promise;
    }

    function _createBill(lrNos,billingColumn,otherBillingColumn) {
      console.log("at createBill")
      //normalize input     
      var columns = billingColumn;
      if(!angular.isUndefined(otherBillingColumn) && otherBillingColumn != null) {
        columns = columns.concat(otherBillingColumn);
      } 
      
      var jsonData=angular.toJson(columns);    
      
    
      var ret = _defResult, d = $q.defer();

      var data = 'lrNos=' +  lrNos +
                 '&billDetails='  + jsonData;
      console.log(" data for createBill "+data);
      
      

      var config = { 
        headers: {
          'service_key': '824bb1e8-de0c-401c-9f83-8b1d18a0ca9d',
          'auth_token' :  userService.getAuthToken(),
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      };

      var $promise = $http.post('http://localhost:8080/LRService/v1/lr-service/createBill', data, config);

      //send ajax form submission
      $promise.then(function(data, status, headers, config) {
        $log.debug('LRBill Info + ' + JSON.stringify(data));

        var result = data.data; // Fix it

        $log.debug(result);
        $log.debug(result.code);

        if(result.code !== 1) {
          //some error
          d.reject(ret);
          return;
        }     

        _updateLRBillDetails(result.lrBill);
        ret.sts = true;
        d.resolve(ret);      

      }, function(r) {
        $log.debug('Error Info + ' + JSON.stringify(r.data));
        ret = _parseErrorResponse(r.data);
        d.reject(ret);
      });
      
      return d.promise;
    }



    return { 
      createLR: _createLR,
      createExpenditure: _createExpenditure,
      createOtherExpenditure: _createOtherExpenditure,
      createOtherIncome:_createOtherIncome,
      updateLR:_updateLR,
      createIncome:_createIncome,
      getConsignerList: _getConsignerList,
      getConsigneeList: _getConsigneeList,
      getBillingnameList:_getBillingnameList,
      getLR: function() {return lr;},      
      removeOtherExpenditure:_removeOtherExpenditure,
      removeOtherIncome:_removeOtherIncome,
      getLRByDate:_getLRByDate,
      getLRList: function() {return lr.LRList;},
      createChalan:_createChalan,
      createBill:_createBill,
      searchLR: _searchLR
    };

  }]);
