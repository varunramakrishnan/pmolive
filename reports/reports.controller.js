(function () {
    'use strict';

    angular
        .module('app')
        .controller('ReportsController', ReportsController);
//   angular
//   .module('app')
//   .component('modalComponent', {
//   templateUrl: 'myModalContent.html',
//   bindings: {
//     resolve: '<',
//     close: '&',
//     dismiss: '&'
//   },
//   controller: function () {
//     var $ctrl = this;

//     $ctrl.$onInit = function () {
//       $ctrl.items = $ctrl.resolve.items;
//       $ctrl.selected = {
//         item: $ctrl.items[0]
//       };
//     };

//     $ctrl.ok = function () {
//       $ctrl.close({$value: $ctrl.selected.item});
//     };

//     $ctrl.cancel = function () {
//       $ctrl.dismiss({$value: 'cancel'});
//     };
//   }
// });
	ReportsController.$inject = ['$rootScope','$q','$timeout','$cookieStore','$scope','$state','$log','$http','UserService', '$location', 'FlashService','RowEditor','$uibModal','$document'];
	function ReportsController($rootScope,$q,$timeout,$cookieStore,$scope,$state,$log,$http,UserService, $location,FlashService,RowEditor,$uibModal, $document) {

        var vm = this;
        vm.getreportdata = getreportdata;
        vm.getnewreport = getnewreport;
        $scope.colors = [ '#fdb45c', '#00ADF9', '#f7464a', '#46BFBD', '#32cd32', '#28022f', '#feca9a'];
        $scope.gridOptions = {};
        $scope.gridOptions.enableHorizontalScrollbar = 0; 
  $rootScope.shownav=true;
  $rootScope.rootAccess =  $cookieStore.get("rootAccess");
  $rootScope.pmAccess =  $cookieStore.get("pmAccess");
  $scope.gridOptions.columnDefs = [
    { field:'id', width:50 ,visible:false },
    { field:'emp_id', width:100 },
    { field:'name' , width:100 },
    { field:'hours', width:80 },
    { field: 'bullet', name:"Click the chart for detailed info", cellTemplate: 'reports/bullet-cell.html',width:350},
    // { field: 'spark', cellTemplate: 'reports/donut-cell.html'}

    
    // { name:'Column Name', cellTemplate: '<spark-line-chart values="grid.appScope.valuesStacked"></spark-line-chart>'}
  ];
  // $scope.gridOptions.rowHeight = 400;
    
  $scope.knoboptions = {
    unit: "%",
  readOnly: true,
  subText: {
    enabled: true,
    text: 'loaded',
    color: 'gray',
    font: 'auto'
  },
  trackWidth: 40,
  barWidth: 25,
  trackColor: '#656D7F',
  barColor: '#2CC185'
    //other options
  };
  $scope.moused = function(id)
  {
    $scope.repdata.forEach(function (d) {
      if (d.id == id){
        // $scope.piedata = d.spark.data.;
        // $scope.pieoptions = d.spark.options;
        $scope.labels = d.spark.label;
        $scope.ydata = d.spark.ydata;
        console.log($scope.labels);
        console.log($scope.ydata);
        // $scope.totalutil = d.spark.data.totalutil;
        $scope.popoverIsVisible = true;
      }
    });
   
   }
   function getnewreport(filter) {
    getreportdata(filter).then(function(response){
  $scope.knobvalue = response.util;
 var data = $scope.repdata = response.donut;
      $scope.gridOptions.data = data;
      });
   }
//   $scope.mousedleave = function() {
//   $scope.popoverIsVisible = false; 
// };
var fullWeekFormat='YYYY-MM-DD';
var weekFullStart = moment().clone().startOf('week');
$scope.week_full=[weekFullStart.day(0).format(fullWeekFormat),weekFullStart.day(1).format(fullWeekFormat),weekFullStart.day(2).format(fullWeekFormat),weekFullStart.day(3).format(fullWeekFormat),weekFullStart.day(4).format(fullWeekFormat),weekFullStart.day(5).format(fullWeekFormat),weekFullStart.day(6).format(fullWeekFormat)];
$scope.month_full=[];
var monthday = moment().startOf('month');
        var month = monthday.month();
        while(month === monthday.month()){
            $scope.month_full.push(monthday.format(fullWeekFormat));
            monthday = monthday.add(1,'days')
        }
var getreportdata = function (filter) {
  var deferred = $q.defer();
      var text= '#btn-pie-group button' ;
        var myEl = angular.element( document.querySelectorAll( text ) ); 
        myEl.removeClass('custactive');
      var date = moment().format(fullWeekFormat);
      if(filter=="today"){
        var newtext= '#btn-today' ;
        var mynewEl = angular.element( document.querySelector( newtext ) );
        mynewEl.addClass('custactive');
        var piepostData = {"dates":[date]};
        
      }else if(filter=="week"){
        var newtext= '#btn-week' ;
        var mynewEl = angular.element( document.querySelector( newtext ) );
        mynewEl.addClass('custactive');
        var piepostData = {"dates":$scope.week_full};
      }else{
        var newtext= '#btn-month' ;
        var mynewEl = angular.element( document.querySelector( newtext ) );
        mynewEl.addClass('custactive');
        var piepostData = {"dates":$scope.month_full};
      }
      
      UserService.getReportData(piepostData)
             .then(function (response) {
             // $scope.repdata =   response.data;
             deferred.resolve(response.data);
             });
      return deferred.promise;
      }

$scope.hidePopover = function () {
  $scope.popoverIsVisible = false;
};
	$scope.gridOptions.rowHeight=50;
//   var data = [
//     {
//         "name": "Ethel Price",
//         "id": 1,
//         "hours": "40",
//         "colour": "red",
//         "company": "Enersol",
//         "spark":{
//         	"data":[{"key":"a","y":2},{"key":"sadasdadas","y":4}]
//         },
//     },
//     {
//         "name": "Claudine Neal",
//         "id": 2,
//         "hours": "35",
//         "colour": "red",
//         "company": "Sealoud",
//         "spark":{
//         	"data":[{"key":1,"y":3},{"key":1,"y":4}]
//         },
//     },
//     {
//         "name": "Beryl Rice",
//         "id": 3,
//         "hours": "35",
//         "colour": "red",
//         "company": "Velity",
//         "spark":{
//         	"data":[{"key":1,"y":4},{"key":1,"y":6}],
//         	// "options":{"chart":""}
//         },
//     }
// ];
 getreportdata("today").then(function(response){
  $scope.knobvalue = response.util;
  
 var data = $scope.repdata = response.donut;

      // data.forEach(function (d) {
    		// d.spark.options = {};
      //   d.spark.options.chart =  {
      //         type: 'pieChart',
      //         donut:true,
      //         height: 600,
      //         width: 600,
      //         showLabels: true,
      //         duration: 500,
      //         x: function(d) { return d.key; },
      //         y: function(d) { return d.y; }
      //       };
      // });

      
      $scope.gridOptions.data = data;
      });
    }



     
    
})();

