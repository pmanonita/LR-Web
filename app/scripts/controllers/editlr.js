  'use strict';

/**
 * @ngdoc function
 * @name lrwebApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the lrwebApp
 */
angular.module('lrwebApp')
  .controller('EditLrCtrl', ['$scope', '$log', '$location', 'lrService','userService', function ($scope, $log, $location, lrService,userService) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ]; 
    $scope.msg = "";
     var handleConsignerSuccess = function(data) {
      $scope.consignerList = data;  
      console.log("hadling success"); 
      
    };
    var handleConsignerError = function(data) {
      $scope.consignerList = [];
    };
     var handleConsigneeSuccess = function(data) {
      $scope.consigneeList = data;  
      console.log("hadling success"); 
      
    };
    var handleConsigneeError = function(data) {
      $scope.consigneeList = [];
    };
    var handleBillingnameSuccess = function(data) {
      $scope.billingnameList = data;  
      console.log("hadling success"); 
      
    };
    var handleBillingnameError = function(data) {
      $scope.billingnameList = [];
    };
    
    lrService.getConsignerList(handleConsignerSuccess, handleConsignerError);
    lrService.getConsigneeList(handleConsigneeSuccess, handleConsigneeError);
    lrService.getBillingnameList(handleBillingnameSuccess, handleBillingnameError);

    $scope.lrotherList = [];
    $scope.chalanColumns = [];
    $scope.lr = lrService.getLR(); 


    $scope.lr.extraPayToBroker=0 ;
    $scope.lr.freightToBroker=0 ;
    $scope.lr.advance=0 ;
    


     $scope.submitExpenditureForm = function(){
      //send a request to user service and submit the form
      $log.debug('on add expenditure for lr form ' );
      lrService.createExpenditure($scope.lr).then(function(/*res*/) {
        //success callback
        $log.debug('LR Expenditure Created Sucessfully');        
        $scope.expmsg = "Expenditure Saved Sucessfully"
      }, function(res) {
        //error callback & show the error message
        $log.debug('Error In LRExpenditure Creation ' + JSON.stringify(res));
        $scope.expmsg = res.msg;
        
      });
      return false;
    };

    $scope.submitIncomeForm = function(){
      //send a request to user service and submit the form
      $log.debug('on add income for lr form ' );
      lrService.createIncome($scope.lr).then(function(/*res*/) {
        //success callback
        $log.debug('LR Income Created Sucessfully');        
        $scope.incomemsg = "Income Saved Sucessfully";
      }, function(res) {
        //error callback & show the error message
        $log.debug('Error In LR Income Creation ' + JSON.stringify(res));
        $scope.incomemsg = res.msg;
        
      });
      return false;
    };

    $scope.submitOtherExpenditureForm = function(){
      //send a request to user service and submit the form
      console.log('on add otherexpenditure for lr form ' );
      lrService.createOtherExpenditure($scope.lr).then(function(/*res*/) {
        //success callback
        $log.debug('LR Other Expenditure Created Sucessfully'); 
        $scope.lr = lrService.getLR();    
        console.log("lr value "+$scope.lr.otherAmount);  
        $scope.lrotherList.push( {'lrNo':$scope.lr.lrNo, 'otherAmount': $scope.lr.otherAmount, 'otherRemarks':$scope.lr.otherRemarks });
        //$scope.lrNo='';
        $scope.lr.otherAmount='';
        $scope.lr.otherRemarks='';   
        $scope.otherexpmsg = "Other Expenditure Created Succesfully";
        //$location.path('/editlr');

      }, function(res) {
        //error callback & show the error message
        $log.debug('Error In LR Other Expenditure Creation ' + JSON.stringify(res));
        $scope.otherexpmsg = res.msg;
        
      });
      return false;
    };

     $scope.submitOtherIncomeForm = function(){
      //send a request to user service and submit the form
      console.log('on add otherincome for lr form ' );
      lrService.createOtherIncome($scope.lr).then(function(/*res*/) {
        //success callback
        $log.debug('LR Other Income Created Sucessfully'); 
        $scope.lr = lrService.getLR();    
        
           
        $scope.otherincomemsg = "Other Income Created Succesfully";
        //$location.path('/editlr');

      }, function(res) {
        //error callback & show the error message
        $log.debug('Error In LR Other Income Creation ' + JSON.stringify(res));
        $scope.otherexpmsg = res.msg;
        
      });
      return false;
    };



    $scope.updateLR = function(){
      //send a request to user service and submit the form
      $log.debug('update LR ' );
      lrService.updateLR($scope.lr).then(function(/*res*/) {
        //success callback
        $log.debug('LR Updated Sucessfully');        
        $scope.msg = "LR Record Updated Successfully";
      }, function(res) {
        //error callback & show the error message
        $log.debug('Error In LR Updation ' + JSON.stringify(res));
        $scope.msg = res.msg;
        
      });
      return false;
    };

     $scope.removeOtherExpenditure = function(otherExpenditureId,lrNo){ 
      console.log("removing lrotherexpenditure "+lrNo);  
       lrService.removeOtherExpenditure(otherExpenditureId,lrNo).then(function(/*res*/) {
        //success callback
        $log.debug('LROtherExpenditure Removed Sucessfully');        
        $scope.otherexpmsg = "Other Expenditure Removed Sucessfully";
        }, function(res) {
        //error callback & show the error message
        $log.debug('Error In LR Updation ' + JSON.stringify(res));
        $scope.otherexpmsg = res.msg;
        
        });
        return false; 
         
    };

     $scope.removeOtherIncome = function(otherIncomeId,lrNo){ 
      console.log("removing lrotherincome "+lrNo);  
       lrService.removeOtherIncome(otherIncomeId,lrNo).then(function(/*res*/) {
        //success callback
        $log.debug('LROtherIncome Removed Sucessfully');        
        $scope.otherincomemsg = "Other Income Removed Sucessfully";
        }, function(res) {
        //error callback & show the error message
        $log.debug('Error In LR Updation ' + JSON.stringify(res));
        $scope.otherincomemsg = res.msg;
        
        });
        return false; 
         
    };

     $scope.saveChalana = function(lrNos,expenditureColumn,otherExpenditureColumn){ 
      
       lrService.createChalan(lrNos,expenditureColumn,otherExpenditureColumn).then(function(/*res*/) {
        //success callback
        $log.debug('LRChalan saved Sucessfully'); 
        $scope.lr = lrService.getLR(); 
        //$scope.chalanColumns = JSON.parse($scope.lr.chalan.chalanDetails);
        $scope.chalanmsg = "Chalan Created Successfully";

        $location.path('/editlr');
        }, function(res) {
        //error callback & show the error message
        $log.debug('Error In Chalan Creation ' + JSON.stringify(res));
        $scope.chalanmsg = res.msg;
        
        });
        return false; 
         
    };

     $scope.saveBill = function(lrNos,billingColumn,otherBillingColumn){ 
      
       lrService.createBill(lrNos,billingColumn,otherBillingColumn).then(function(/*res*/) {
        //success callback
        $log.debug('LRBill saved Sucessfully'); 
        $scope.lr = lrService.getLR(); 
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
