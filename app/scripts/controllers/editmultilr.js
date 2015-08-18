'use strict';

/**
 * @ngdoc function
 * @name lrwebApp.controller:EditMultiLRCtrl
 * @description
 * # EditMultiLRCtrl
 * Controller of the lrwebApp
 */
angular.module('lrwebApp')
  .controller('EditMultiLRCtrl',['$scope', '$log', '$location', 'lrService', 'userService',
    function ($scope, $log, $location, lrService, userService){

    $scope.msg = "";
    
    $scope.transaction = lrService.getTransaction();
    var handleBillingnameSuccess = function(data) {
      $scope.billingnameList = data; 
    };
    var handleBillingnameError = function(data) {
      $scope.billingnameList = [];
    };
    lrService.getBillingnameList(handleBillingnameSuccess, handleBillingnameError);

    var freightToBroker  = $scope.transaction.freightToBroker  || 0;
    var extraPayToBroker = $scope.transaction.extraPayToBroker || 0;
    var advance          = $scope.transaction.advance          || 0;   
    $scope.transaction.balanceFreight = freightToBroker - (extraPayToBroker + advance);


    $scope.$watch('transaction.freightToBroker - (transaction.extraPayToBroker + transaction.advance)', function (value) {
        $scope.transaction.balanceFreight = value;
    });


     $scope.$watch('text', function(v) {
      for (var i in $scope.billingnameList) {
        var option = $scope.billingnameList[i];
        if (option.name === v) {
          $scope.transaction.billingname = option;
          break;
        }
      }
    });

    $scope.editTransaction = function() {      
      lrService.editTransaction($scope.transaction).then(function(u) {        
        $scope.transaction = lrService.getTransaction();       
        $scope.msg = "Edit Successful"
                
      }, function(res) {        
        $log.debug('Issue while editing Multi LR data' + JSON.stringify(res));
        $scope.msg = res.msg;
      });
      return false;
    };

    $scope.submitOtherExpenditureForm = function(){
      //send a request to user service and submit the form
      console.log('on add otherexpenditure for transaction form ' );
      lrService.createTransOtherExpenditure($scope.transaction).then(function(u) {
        //success callback
        $log.debug('LRTransaction Other Expenditure Created Sucessfully'); 
        $scope.transaction = lrService.getTransaction();       
        $scope.otherexpmsg = "Other Expenditure Added Successfully"

      }, function(res) {
        //error callback & show the error message
        $log.debug('Error In MultiLR Other Expenditure Creation ' + JSON.stringify(res));
        $scope.otherexpmsg = res.msg;
        
      });
      return false;
    };

     $scope.submitOtherIncomeForm = function(){
      //send a request to user service and submit the form
      console.log('on add otherincome for lr form ' );
      lrService.createTransOtherIncome($scope.transaction).then(function(u) {
        //success callback
        $log.debug('LRTransaction Other Income Created Sucessfully'); 
        $scope.transaction = lrService.getTransaction();     
        $scope.otherincomemsg = "Other Income Created Succesfully";
        //$location.path('/editlr');

      }, function(res) {
        //error callback & show the error message
        $log.debug('Error In LR Other Income Creation ' + JSON.stringify(res));
        $scope.otherexpmsg = res.msg;
        
      });
      return false;
    };

    $scope.removeOtherExpenditure = function(lrTransOtherExpenditureId,transId){ 
        console.log("removing lrtransotherexpenditure "+lrNo);  
       lrService.removeTransOtherExpenditure(lrTransOtherExpenditureId,transId).then(function(u) {
        //success callback
        $log.debug('LRTransOtherExpenditure Removed Sucessfully');   
        $scope.transaction = lrService.getTransaction();          
        $scope.otherexpmsg = "Other Expenditure Removed Sucessfully";
        }, function(res) {
        //error callback & show the error message
        $log.debug('Error In LRTranscarion other expenditure deletion ' + JSON.stringify(res));
        $scope.otherexpmsg = res.msg;
        
        });
        return false; 
         
    };

     $scope.removeOtherIncome = function(lrTransOtherIncomeId,transId){ 
      console.log("removing lrtransotherincome "+lrNo);  
       lrService.removeTransOtherIncome(lrTransOtherIncomeId,transId).then(function(u) {
        //success callback
        $log.debug('LRTransOtherIncome Removed Sucessfully');  
        $scope.transaction = lrService.getTransaction();          
        $scope.otherincomemsg = "Other Income Removed Sucessfully";
        }, function(res) {
        //error callback & show the error message
        $log.debug('Error In LRTransaction Other Income deletion ' + JSON.stringify(res));
        $scope.otherincomemsg = res.msg;
        
        });
        return false; 
         
    };

     $scope.saveChalana = function(lrNos,expenditureColumn,otherExpenditureColumn,transId){ 
      
       lrService.createTransChalan(lrNos,expenditureColumn,otherExpenditureColumn,transId).then(function(u) {
        //success callback
        $log.debug('LRChalan saved Sucessfully'); 
        $scope.transaction = lrService.getTransaction();           
        //$scope.chalanColumns = JSON.parse($scope.lr.chalan.chalanDetails);
        $scope.chalanmsg = "Chalan Created Successfully";
        
        }, function(res) {
        //error callback & show the error message
        $log.debug('Error In Chalan Creation ' + JSON.stringify(res));
        $scope.chalanmsg = res.msg;
        
        });
        return false; 
         
    };

     $scope.saveBill = function(lrNos,billingColumn,otherBillingColumn,transId){ 
      
       lrService.createTransBill(lrNos,billingColumn,otherBillingColumn,transId).then(function(u) {
        //success callback
        $log.debug('LRBill saved Sucessfully'); 
        $scope.transaction = lrService.getTransaction();           
        //$scope.billColumns = JSON.parse($scope.lr.bill.billDetails);
        $scope.billmsg = "Bill Created Successfully";

       
        }, function(res) {
        //error callback & show the error message
        $log.debug('Error In Bill Creation ' + JSON.stringify(res));
        $scope.billmsg = res.msg;
        
        });
        return false; 
         
    };

 
    $scope.printDiv = function(divName) {
      var printContents = document.getElementById(divName).innerHTML;
      var popupWin = window.open('', '_blank', 'width=300,height=300');
      popupWin.document.open()
      popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + printContents + '</html>');
      popupWin.document.close();

    } 
       
  }]);
