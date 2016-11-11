(function () {
    'use strict';

    angular
        .module('app')
        .controller('ReportsController', ReportsController);
	ReportsController.$inject = ['$rootScope','$q','$timeout','$cookieStore','$scope','$state','$log','$http','UserService', '$location', 'FlashService','RowEditor','$uibModal','$document'];
	function ReportsController($rootScope,$q,$timeout,$cookieStore,$scope,$state,$log,$http,UserService, $location,FlashService,RowEditor,$uibModal, $document) {

        var vm = this;
        vm.getreportdata = getreportdata;
        vm.getnewreport = getnewreport;
        var splits=$location.url().toString().split("/");
         $scope.managercustomTexts = {buttonDefaultText: 'Select Manager'};
          $scope.peoplecustomTexts = {buttonDefaultText: 'People'};
        console.log(splits);
        
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
    { field: 'bullet', name:"Click the meter for detailed info", cellTemplate: 'reports/bullet-cell.html',width:400},
  ];
  
  $scope.knoboptions = {
  displayPrevious: true,
  unit: "%",
  size: 100,
  readOnly: true,
  subText: {
    enabled: true,
    // text: 'loaded',
    color: 'black',
    font: '2px'
  },
  // barCap: 10,
  trackWidth: 15,
  barWidth: 13,
  trackColor: '#cfcfcf',
  barColor: 'limegreen',
  textColor: 'black'
};
  $scope.moused = function(id)
  {
    $scope.repdata.forEach(function (d) {
      if (d.id == id){
        $scope.labels = d.spark.label;
        $scope.ydata = d.spark.ydata;
        $scope.name = d.name;
        $scope.emp_id = d.emp_id;
        $scope.perc = d.perc;
        $scope.popoverIsVisible = true;
      }
    });
   
   }
     $scope.managersettings = {
            smartButtonMaxItems: 1,
            scrollableHeight: '200px',
            scrollable: true,
            enableSearch: true,
            displayProp:'employee_name',
            idProp:'id',
            externalIdProp:'id',
            selectionLimit: 1,
            showUncheckAll :false,
            closeOnSelect:true

          };
           $scope.peoplesettings = {
            smartButtonMaxItems: 1,
            scrollableHeight: '200px',
            scrollable: true,
            enableSearch: true,
            displayProp:'employee_name',
            idProp:'id',
            externalIdProp:'id',
            selectionLimit: 1,
            showUncheckAll :false,
            closeOnSelect:true

          };
          
              
           $scope.managermodel= [];
           $scope.peoplemodel= [];
           UserService.getManagers()
                           .then(function (response) {

                  $scope.managerdata = response.data.success;

                  console.log('response'+$scope.managerdata.employee_name);
                  var filtered = [];
                  angular.forEach($scope.managerdata, function(item) {
                    filtered.push(item);
                  });
                  filtered.sort(function (a, b) {
                    return (a.employee_name> b.employee_name? 1 : -1);
                  });
                  console.log('filtered...'+JSON.stringify(filtered));
                  $scope.managerdata=filtered;

                });

            $scope.managerEvents = {
             onItemSelect: function(item) {
              $scope.people=item;
              UserService.resourcesUnderManager(item.id)
                           .then( function (response) {
                            console.log('passed..'+item.id);
                  $scope.peopledata=response.data.success;
                  console.log('response.data...'+response.data);
                            });



             }
           }
                         


/*$scope.managerEvents = {
             onItemSelect: function(item) {
            console.log('entered..');
              FlashService.clearMessage();
              $scope.per = "P";
              $scope.managermodel= [];
              $scope.showsave = 1;
              $scope.items.length=0;
              $scope.resmodel.length=0;
              $scope.resource=0;
              $scope.IsVisible=$scope.calmodel=$scope.showprodate=$scope.people=item.id;
                UserService.getManagers()
                           .then(function (response) {
                  $scope.managerdata = response.data.employee_name ;
                  var filtered = [];
                  angular.forEach($scope.managerdata, function(item) {
                    filtered.push(item);
                  });
                  filtered.sort(function (a, b) {
                    return (a.employee_name > b.employee_name? 1 : -1);
                  });
                  $scope.managerdata=filtered;

                });
                UserService.getallFilteredResources(item.id).then(function (response){
                  $scope.example13data = response.data ;

                  var filtered = [];
                  angular.forEach($scope.example13data, function(item) {
                    filtered.push(item);
                  });
                  filtered.sort(function (a, b) {
                    return (a.employee_name > b.employee_name? 1 : -1);
                  });
                  $scope.example13data=filtered;

                  UserService.getModeledResource(item.id).then(function (response){
                    $scope.example13model = response.data;    
            
                    if($scope.example13model){
                      $scope.addresmodel=$scope.showreshere=1;
                      $scope.calrangemodel=0;
                    }
                  });
                 /* UserService.getMappedResource(item.id).then(function (response){
                  $scope.items = response.data ;
                  if($scope.items.length){
                    $scope.hidesave=0;
                  }else{
                    $scope.hidesave=1;
                  }
                  $scope.existingItems = angular.copy(response.data);
                  });
                });*/
                /*UserService.getAccount(item.id).then(function (response){
                  $scope.account = response.data ;
                  $scope.newMax = $scope.account.end_date;
                  $scope.newMin = $scope.account.start_date;

                  $rootScope.$broadcast('refreshDatepickers');
                  $scope.IsVisible = 0; 
                });*/

                /*$scope.eventSources = [fetchEvents];
                function fetchEvents(start, end, timezone, callback) {
                  var aid = "";
                  aid=$scope.accountmodel.id;
                  var newEvents = [];
                  UserService.getAccountResource(aid).then(function(response) {
                    angular.forEach(response.data, function (obj) {
                     newEvents.push({
                      title: obj.title,
                      start: new Date(Number(obj.start)+19800),
                      allDay: true,
                    });
                   });
                    angular.copy(newEvents, $scope.events);
                    callback($scope.events);
                  });  
                }
                $('#mycalendar').fullCalendar('refetchEvents') ;
              },
            };*/














   function getnewreport(filter) {
    getreportdata(filter).then(function(response){
  $scope.knobvalue = response.util;
  $scope.total_hrs = response.total_hrs;
  $scope.util_hrs = response.util_hrs;
 var data = $scope.repdata = response.donut;
      $scope.gridOptions.data = data;
      });
   }
  $scope.mousedleave = function() {
  $scope.popoverIsVisible = false; 
};
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
        $scope.filter = "today";
        var newtext= '#btn-today' ;
        var mynewEl = angular.element( document.querySelector( newtext ) );
        mynewEl.addClass('custactive');
        var piepostData = {"dates":[date]};
        
      }else if(filter=="week"){
        $scope.filter = "this week";
        var newtext= '#btn-week' ;
        var mynewEl = angular.element( document.querySelector( newtext ) );
        mynewEl.addClass('custactive');
        var piepostData = {"dates":$scope.week_full};
      }else{
        $scope.filter = "this month";
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
if(splits[3]){
          $scope.repdata.forEach(function (d) {
            if (d.id == splits[3]){
              $scope.labels = d.spark.label;
              $scope.ydata = d.spark.ydata;
              $scope.name = d.name;
              $scope.emp_id = d.emp_id;
              $scope.perc = d.perc;
              $scope.popoverIsVisible = true;
            }
          });
        }else{
          getreportdata("today").then(function(response){

  $scope.knobvalue = response.util;
  $scope.total_hrs = response.total_hrs;
  $scope.util_hrs = response.util_hrs;
 var data = $scope.repdata = response.donut;
      $scope.gridOptions.data = data;
      });

        }
 
    }


   



     
    
})();

