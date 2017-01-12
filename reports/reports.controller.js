(function () {
    'use strict';

    angular
        .module('app')
        .controller('ReportsController', ReportsController);
	ReportsController.$inject = ['$rootScope','$q','$timeout','$cookieStore','$scope','$state','$log','$http','UserService', '$location', 'FlashService','RowEditor','$uibModal','$document'];
	function ReportsController($rootScope,$q,$timeout,$cookieStore,$scope,$state,$log,$http,UserService, $location,FlashService,RowEditor,$uibModal, $document) {

        var vm = this;
        $scope.managermodel= [];
           $scope.peoplemodel= [];
        vm.getreportdata = getreportdata;
        vm.getDates = getDates;
        vm.getnewreport = getnewreport;
        vm.resetdata = resetdata ; 
         vm.myFunc = myFunc ;
        vm.myprevFunc = myprevFunc ;
        vm.mynextFunc = mynextFunc ;
        vm.myprevWeek = myprevWeek ; 


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
  $scope.open3 = function() {
    $scope.popup3.opened = true;
  };
  $scope.popup3={};




  $scope.open4 = function() {
    $scope.popup4.opened = true;
  };
  $scope.popup4={};


 $scope.myVar = false;
$scope.toggle = function() {
  $scope.myVar = !$scope.myVar;
  $scope.myVar1 = false;
  $scope.myVar2 = false;
  $scope.startdate = "";
  $scope.enddate = "";
  };


   $scope.myVar1 = false;
$scope.toggleweek = function() {
  $scope.myVar1 = !$scope.myVar1;
   $scope.myVar = false;
    $scope.myVar2 = false;
    $scope.startdate = "";
    $scope.enddate = "";
  };



   $scope.myVar2 = false;
$scope.togglemonth = function() {
  $scope.myVar2 = !$scope.myVar2;
  $scope.myVar = false;
   $scope.myVar1 = false;
   $scope.startdate = "";
   $scope.enddate = "";
  };



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
  barColor: 'red',
  textColor: 'black',
  dynamicOptions: true
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
            scrollableHeight: '200px',
            scrollable: true,
            enableSearch: true,
            displayProp:'employee_name',
            idProp:'id',
            externalIdProp:'',
            buttonClasses:"smbutton btn btn-default",

          };
           $scope.peoplesettings = {
            scrollableHeight: '200px',
            scrollable: true,
            enableSearch: true,
            displayProp:'employee_name',
            idProp:'id',
            externalIdProp:'',
            buttonClasses:"smbutton btn btn-default"

          };

          $scope.datesettings = {
            scrollableHeight: '200px',
            scrollable: true,
            enableSearch: true,
            displayProp:'date',
            idProp:'id',
            externalIdProp:'',
            buttonClasses:"smbutton btn btn-default",

          };

          function resetdata() {
            $scope.peopledata = angular.copy($scope.originalpeopledata);
            $scope.peoplemodel.length = 0;
            $scope.managermodel.length = 0;
            $scope.startdate = "";
            $scope.enddate = "";
            $scope.myVar = false;
            $scope.myVar1 = false;
            $scope.myVar2 = false;



   getreportdata("today").then(function(response){
        $scope.knobvalue = response.util;
        $scope.total_hrs = response.total_hrs;
        $scope.util_hrs = response.util_hrs;
       var data = $scope.repdata = response.donut;
            $scope.gridOptions.data = data;
            });    
   }
          
          
              
           
           UserService.getManagers()
                           .then(function (response) {

                  $scope.managerdata = response.data.success;

                  });
           UserService.getResources().then(function (response) {
            $scope.peopledata = response.data;
            $scope.originalpeopledata = angular.copy($scope.peopledata);

            var filtered = [];
                  angular.forEach($scope.peopledata, function(item) {
                    filtered.push(item);
                  });
                  filtered.sort(function (a, b) {
                    return (a.employee_name > b.employee_name? 1 : -1);
                  });
            $scope.peopledata=filtered;

          });

            $scope.managerEvents = {
             onItemSelect: function(item) {
              $scope.people=item;
              $scope.peoplemodel.length = 0;
              UserService.resourcesUnderManager($scope.managermodel)
                           .then( function (response) {
                  $scope.peopledata=response.data.success;
                  getreportdata("today").then(function(response){
                      $scope.knobvalue = response.util;
                      $scope.total_hrs = response.total_hrs;
                      $scope.util_hrs = response.util_hrs;
                     var data = $scope.repdata = response.donut;
                          $scope.gridOptions.data = data;
                          });
                            });



             },
             onItemDeselect: function(item) {
              $scope.peoplemodel.length = 0;
                UserService.resourcesUnderManager($scope.managermodel)
                           .then( function (response) {
                  $scope.peopledata=response.data.success;
                  getreportdata("today").then(function(response){
                      $scope.knobvalue = response.util;
                      $scope.total_hrs = response.total_hrs;
                      $scope.util_hrs = response.util_hrs;
                     var data = $scope.repdata = response.donut;
                          $scope.gridOptions.data = data;
                          });
                            });
            },
             onDeselectAll: function() {
          $scope.peoplemodel.length = 0;
                UserService.resourcesUnderManager($scope.managermodel)
                           .then( function (response) {
                  $scope.peopledata=response.data.success;
                  getreportdata("today").then(function(response){
                      $scope.knobvalue = response.util;
                      $scope.total_hrs = response.total_hrs;
                      $scope.util_hrs = response.util_hrs;
                     var data = $scope.repdata = response.donut;
                          $scope.gridOptions.data = data;
                          });
                            });
          },
           }
           $scope.peopleEvents = {
             onItemSelect: function(item) {
              // $scope.people=item;
              getreportdata("today").then(function(response){
                $scope.knobvalue = response.util;
                $scope.total_hrs = response.total_hrs;
                $scope.util_hrs = response.util_hrs;
                var data = $scope.repdata = response.donut;
                    $scope.gridOptions.data = data;
                    });
             },
             onItemDeselect: function(item) {
                getreportdata("today").then(function(response){
                $scope.knobvalue = response.util;
                $scope.total_hrs = response.total_hrs;
                $scope.util_hrs = response.util_hrs;
                var data = $scope.repdata = response.donut;
                    $scope.gridOptions.data = data;
                    });
            },
            onDeselectAll: function() {
                getreportdata("today").then(function(response){
                $scope.knobvalue = response.util;
                $scope.total_hrs = response.total_hrs;
                $scope.util_hrs = response.util_hrs;
                var data = $scope.repdata = response.donut;
                    $scope.gridOptions.data = data;
                    });
          },
           }

    

    function myFunc() {
    if($scope.startdate && $scope.enddate){
    var start = $scope.startdate;
    var end =  $scope.enddate;
    $scope.dateArray = [];
    var currentDate = moment(start);
    var endDate = moment(end);
     
    while (endDate >= currentDate) {
        $scope.dateArray.push(currentDate.format("YYYY-MM-DD"));
        currentDate = currentDate.add(1, 'days');
        console.log(currentDate);

    }
    
              getreportdata("currentDate").then(function(response){
                $scope.knobvalue = response.util;
                $scope.total_hrs = response.total_hrs;
                $scope.util_hrs = response.util_hrs;
                var data = $scope.repdata = response.donut;
                    $scope.gridOptions.data = data;
                    });
              }
};



  function myprevFunc() {

    var previousDay  = moment();
    previousDay = previousDay.subtract(1, "days");
    $scope.previousDay = previousDay.format("YYYY-MM-DD");
     console.log(previousDay)
    

    getreportdata("previousDay").then(function(response){
                $scope.knobvalue = response.util;
                $scope.total_hrs = response.total_hrs;
                $scope.util_hrs = response.util_hrs;
                var data = $scope.repdata = response.donut;
                    $scope.gridOptions.data = data;
                    });
};



 function mynextFunc() {
   var nextDay  = moment();
    nextDay = nextDay.add(1, "days");
    $scope.nextDay = nextDay.format("YYYY-MM-DD");
     console.log(nextDay)



    getreportdata("nextDay").then(function(response){
                $scope.knobvalue = response.util;
                $scope.total_hrs = response.total_hrs;
                $scope.util_hrs = response.util_hrs;
                var data = $scope.repdata = response.donut;
                    $scope.gridOptions.data = data;
                    });

   };







  function myprevWeek() {
  var currentDate = moment();
  $scope.calculateWeekDay = function() {
    //var weekStart = currentDate.clone().startOf('week');
    //var weekEnd = currentDate.clone().endOf('week');
    var weekStart = moment().subtract(1, 'weeks').startOf('isoWeek')
    var weekEnd = moment().subtract(1, 'weeks').endOf('isoWeek')

    //var days = [];
    $scope.days = [];
    for (i = 0; i <= 6; i++) {
      $scope.days.push(moment(weekStart).add(i, 'days').format("YYYY-MM-DD"));
    };

    $scope.weekDays = days;
  };

   $scope.previousWeek = function() {
    currentDate = currentDate.subtract(1, week);
    $scope.calculateWeekDay();
  };
   
   getreportdata("previousWeek").then(function(response){
                $scope.knobvalue = response.util;
                $scope.total_hrs = response.total_hrs;
                $scope.util_hrs = response.util_hrs;
                var data = $scope.repdata = response.donut;
                    $scope.gridOptions.data = data;
                    });

};










/*  function myFunc() {
    if($scope.startdate && $scope.enddate){
    var start = $scope.startdate;
    var end =  $scope.enddate;
    $scope.dateArray = [];
    var currentDate = moment(start);
    var endDate = moment(end);
     
    while (endDate >= currentDate) {
        $scope.dateArray.push(currentDate.format("YYYY-MM-DD"));
        currentDate = currentDate.add(1, 'days');
        console.log(currentDate);

*/





function getnewreport(filter) {
    getreportdata(filter).then(function(response){
  $scope.knobvalue =  response.util;
  console.log($scope.knobvalue)

  if($scope.knobvalue <= 50){
     $scope.knoboptions.barColor =  'red';
  }else if($scope.knobvalue<=70){
       $scope.knoboptions.barColor =  'brown';
  }else if($scope.knobvalue<=85){
       $scope.knoboptions.barColor =  'green';
  }else{
       $scope.knoboptions.barColor =  'blue';
  }
  $scope.total_hrs = response.total_hrs;
  $scope.util_hrs = response.util_hrs;
 var data = $scope.repdata = response.donut;
      $scope.gridOptions.data = data;
      });
   }
  $scope.mousedleave = function() {
  $scope.popoverIsVisible = false; 
};



var startdateFormat='YYYY-MM-DD';
var enddateFormat='YYYY-MM-DD';


function getDates() {
  var start = $scope.startdate;
  var end =  $scope.enddate;
  var dateArray = [];
   var currentDate = moment(start);
     var endDate = moment(end);
     
    while (endDate >= currentDate) {
        dateArray.push(currentDate.format("YYYY-MM-DD"));
        currentDate = currentDate.add(1, 'days');
        console.log(currentDate);

    }
    console.log(dateArray);
    return dateArray;
}


       
        var start = $scope.startdate;
        var end =  $scope.enddate;
        var currentDate = moment(start);



var weekFullStart = moment().clone().startOf('start_date');


$scope.start_date=[weekFullStart.day(0).format(fullWeekFormat),weekFullStart.day(1).format(fullWeekFormat),weekFullStart.day(2).format(fullWeekFormat),weekFullStart.day(3).format(fullWeekFormat),weekFullStart.day(4).format(fullWeekFormat),weekFullStart.day(5).format(fullWeekFormat),weekFullStart.day(6).format(fullWeekFormat)];
$scope.month_full=[];

/*var monthday = moment().startOf('month');
              var monthday =[];
        var month = monthday.month();
        while(month === monthday.month()){
            $scope.month_full.push(monthday.format(fullWeekFormat));
            monthday = monthday.add(1,'days');
          }*/
            
            

var fullWeekFormat='YYYY-MM-DD';
var weekFullStart = moment().clone().startOf('week');
$scope.week_full=[weekFullStart.day(0).format(fullWeekFormat),weekFullStart.day(1).format(fullWeekFormat),weekFullStart.day(2).format(fullWeekFormat),weekFullStart.day(3).format(fullWeekFormat),weekFullStart.day(4).format(fullWeekFormat),weekFullStart.day(5).format(fullWeekFormat),weekFullStart.day(6).format(fullWeekFormat)];
//$scope.month_full=[];
var prevWeek =[];
var prevWeek = moment().subtract(1, 'weeks').startOf('isoWeek');
$scope.prevweek_full=[prevWeek.day(0).format(fullWeekFormat),prevWeek.day(1).format(fullWeekFormat),prevWeek.day(2).format(fullWeekFormat),prevWeek.day(3).format(fullWeekFormat),prevWeek.day(4).format(fullWeekFormat),prevWeek.day(5).format(fullWeekFormat),prevWeek.day(6).format(fullWeekFormat)];

     var  nextWeek =[];
     var nextWeek = moment().add(1, 'weeks').startOf('isoWeek');
     $scope.nextweek_full=[nextWeek.day(0).format(fullWeekFormat),nextWeek.day(1).format(fullWeekFormat),nextWeek.day(2).format(fullWeekFormat),nextWeek.day(3).format(fullWeekFormat),nextWeek.day(4).format(fullWeekFormat),nextWeek.day(5).format(fullWeekFormat),nextWeek.day(6).format(fullWeekFormat)];

var monthday = moment().startOf('month');
        var month = monthday.month();
        while(month === monthday.month()){
            $scope.month_full.push(monthday.format(fullWeekFormat));
              monthday = monthday.add(1,'days')
        }
           var prevMonth =[];
           $scope.prevMonth = new moment().subtract(1, 'months').date(1).format('YYYY-MM-DD');
           console.log($scope.prevMonth)
          $scope.prevmonth_full=[];
            var monthday = moment( $scope.prevMonth);
            var month = monthday.month();
               while(month === monthday.month()){
              $scope.prevmonth_full.push(monthday.format(fullWeekFormat));
               monthday = monthday.add(1,'days');
             }



            var nexttMonth =[];
           $scope.nexttMonth = new moment().add(1, 'months').date(1).format('YYYY-MM-DD');
           console.log($scope.nexttMonth)
          $scope.nextmonth_full=[];
            var monthday = moment( $scope.nexttMonth);
            var month = monthday.month();
               while(month === monthday.month()){
              $scope.nextmonth_full.push(monthday.format(fullWeekFormat));
               monthday = monthday.add(1,'days');
             }


























var getreportdata = function (filter) {
  var deferred = $q.defer();
  if($scope.peoplemodel.length){
    var pdata = $scope.peoplemodel;
  }else{
    var pdata = $scope.peopledata;
    }


      var text= '#btn-pie-group button' ;
        var myEl = angular.element( document.querySelectorAll( text ) ); 
        myEl.removeClass('custactive');
      var date = moment().format(fullWeekFormat);


      
      if(filter=="today"){
        $scope.filter = "today";
        var newtext= '#btn-today' ;
        var mynewEl = angular.element( document.querySelector( newtext ) );
        //mynewEl.addClass('custactive');
        var piepostData = {"dates":[date],"resource":pdata};
        }



      

         
      else if(filter=="currentDate"){
        $scope.filter = "currentDate";
        var newtext= '#btn-week' ;
        var mynewEl = angular.element( document.querySelector( newtext ) );
        /*mynewEl.addClass('custactive');*/
        var piepostData = {"dates":$scope.dateArray,"resource":pdata};
        }

     


      else if(filter=="previousDay"){
        $scope.filter = "previousDay";
        var newtext= '#btn-week' ;
        var mynewEl = angular.element( document.querySelector( newtext ) );
         var piepostData = {"dates":[$scope.previousDay],"resource":pdata};
         }



      else if(filter=="nextDay"){
        $scope.filter = "nextDay";
        var newtext= '#btn-week' ;
        var mynewEl = angular.element( document.querySelector( newtext ) );
         var piepostData = {"dates":[$scope.nextDay],"resource":pdata};
         }



      else if(filter=="week"){
        $scope.filter = "this week";
        var newtext= '#btn-week' ;
        var mynewEl = angular.element( document.querySelector( newtext ) );
        mynewEl.addClass('custactive');
        var piepostData = {"dates":$scope.week_full,"resource":pdata};
        }




       else if(filter=="previousWeek"){
        $scope.filter = "previousWeek";
        var newtext= '#btn-week' ;
        var mynewEl = angular.element( document.querySelector( newtext ) );
        mynewEl.addClass('custactive');
        //var piepostData = {"dates":$scope.prevWeek,"resource":pdata};
        //var piepostData = {"dates":[$scope.previousWeek],"resource":pdata};
         var piepostData = {"dates":$scope.prevweek_full,"resource":pdata};
        }

             
        else if(filter=="nextWeek"){
        $scope.filter = "nextWeek";
        var newtext= '#btn-week' ;
        var mynewEl = angular.element( document.querySelector( newtext ) );
        mynewEl.addClass('custactive');
        var piepostData = {"dates":$scope.nextweek_full,"resource":pdata};
        }


        else if(filter=="month"){
        $scope.filter = "this month";
        var newtext= '#btn-month' ;
        var mynewEl = angular.element( document.querySelector( newtext ) );
        mynewEl.addClass('custactive');
        var piepostData = {"dates":$scope.month_full,"resource":pdata};
      }
      

        else if(filter=="previousMonth"){
        $scope.filter = "previousMonth";
        var newtext= '#btn-month' ;
        var mynewEl = angular.element( document.querySelector( newtext ) );
        mynewEl.addClass('custactive');
        var piepostData = {"dates":$scope.prevmonth_full,"resource":pdata};
      }


      else {
        $scope.filter = "nextMonth";
        var newtext= '#btn-month' ;
        var mynewEl = angular.element( document.querySelector( newtext ) );
        mynewEl.addClass('custactive');
        var piepostData = {"dates":$scope.nextmonth_full,"resource":pdata};
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
            $scope.knoboptions = {
              displayPrevious: true,
              unit: "%",
              size: 100,
              readOnly: true,

              subText: {
                enabled: true,
                color: 'black',
                font: '2px'
              },
             
              trackWidth: 15,
              barWidth: 13,
              trackColor: '#cfcfcf',
              textColor: 'black',
              dynamicOptions: true

 };

  $scope.knobvalue =  response.util;
  if($scope.knobvalue <= 50){
     $scope.knoboptions.barColor =  'red';
   }else if($scope.knobvalue<=70){
       $scope.knoboptions.barColor =  'brown';
  }else if($scope.knobvalue<=85){
       $scope.knoboptions.barColor =  'green';
  }else{
$scope.knoboptions.barColor =  'red';
  }
  console.log($scope.knobvalue);
  $scope.total_hrs = response.total_hrs;
  $scope.util_hrs = response.util_hrs;
 var data = $scope.repdata = response.donut;
      $scope.gridOptions.data = data;
      });

        }
 
    }
})();

