(function () {
    'use strict';

    angular
        .module('app')
        .controller('ReportsController', ReportsController);
	ReportsController.$inject = ['$rootScope','$q','$timeout','$cookieStore','$scope','$state','$log','$http','UserService', '$location', 'FlashService','RowEditor','$uibModal','$document'];
	function ReportsController($rootScope,$q,$timeout,$cookieStore,$scope,$state,$log,$http,UserService, $location,FlashService,RowEditor,$uibModal, $document) {

        var vm = this;
        $scope.showservice=0;
        $scope.managermodel= [];
        $scope.getArray= [];
        $scope.getArrayRaw= [];
        $scope.peoplemodel= [];
        $scope.accountmodel= [];
        $scope.servicemodel= [];
        vm.getreportdata = getreportdata;
        // vm.getDates = getDates;
        vm.switcher = switcher;
        vm.getnewreport = getnewreport;
        vm.resetdata = resetdata ; 
         vm.myFunc = myFunc ;
        vm.myprevFunc = myprevFunc ;
        vm.mynextFunc = mynextFunc ;
        vm.myprevWeek = myprevWeek ; 

        var d=new Date();
        var splits=$location.url().toString().split("/");
         $scope.managercustomTexts = {buttonDefaultText: 'Select Manager'};
          $scope.peoplecustomTexts = {buttonDefaultText: 'People'};
        console.log(splits);
        
        $scope.colors = [ '#fdb45c', '#00ADF9', '#f7464a', '#46BFBD', '#32cd32', '#28022f', '#feca9a'];
        // $scope.gridOptions = {};
        // $scope.gridOptions.enableHorizontalScrollbar = 0; 
  $rootScope.shownav=true;
  $rootScope.rootAccess =  $cookieStore.get("rootAccess");
  $rootScope.pmAccess =  $cookieStore.get("pmAccess");
  $scope.gridOptions= {
    enableHorizontalScrollbar : 0,
    columnDefs : [
    { field:'id', width:50 ,visible:false },
    { field:'emp_id',name:'Emp Id', width:100 },
    { field:'name' , name:'Name',width:100 },
    { field:'hours', name:'Hours', width:80 },
    { field: 'bullet', name:"Click the meter for detailed info", cellTemplate: 'reports/bullet-cell.html',width:400},
  ],
  enableGridMenu: true,
        enableCellEdit: false,
        enableSelectAll: true,
        exporterMenuPdf: false,
        exporterCsvFilename: 'OMC_Time_'+d.toDateString().split(' ').join('_')+'.csv',
        // exporterPdfDefaultStyle: {fontSize: 9},
        // exporterPdfTableStyle: {margin: [30, 30, 30, 30]},
        // exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'red'},
        // exporterPdfHeader: { text: "My Header", style: 'headerStyle' },
        // exporterPdfFooter: function ( currentPage, pageCount ) {
        //   return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
        // },
        // exporterPdfCustomFormatter: function ( docDefinition ) {
        //   docDefinition.styles.headerStyle = { fontSize: 22, bold: true };
        //   docDefinition.styles.footerStyle = { fontSize: 10, bold: true };
        //   return docDefinition;
        // },
        // exporterPdfOrientation: 'portrait',
        // exporterPdfPageSize: 'LETTER',
        // exporterPdfMaxGridWidth: 500,
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        onRegisterApi: function(gridApi){
          $scope.gridApi = gridApi;
        }
        

  }
        

  $scope.open3 = function() {
    $scope.popup3.opened = true;
  };
  $scope.myVar = true;
  $scope.popup3={};
  UserService.getAccounts().then(function (response) {
            $scope.accountdata = response.data;
            var filtered = [];
                  angular.forEach($scope.accountdata, function(item) {
                    filtered.push(item);
                  });
                  filtered.sort(function (a, b) {
                    return (a.account_name > b.account_name? 1 : -1);
                  });
            $scope.accountdata=filtered;
          });
  function switcher(filter) {
      var text= '#btn-pie-group button' ;
      var myEl = angular.element( document.querySelectorAll( text ) ); 
      myEl.removeClass('custactive');
      // var wid=moment().format(weekYear);
      // var date = moment().format(fullWeekFormat);
      if(filter=="day"){
        $scope.myVar = true;
        $scope.myVar1 = false;
        $scope.myVar2 = false;
        var newtext= '#btn-day' ;
        var mynewEl = angular.element( document.querySelector( newtext ) );
        mynewEl.addClass('custactive');
        getnewreport('today');
        // var piepostData = {"rid":resource_id,"filter":"today","week_id":wid,"dates":[date]};
        
      }else if(filter=="week"){
         $scope.myVar1 = true;
          $scope.myVar = false;
          $scope.myVar2 = false;
        var newtext= '#btn-week' ;
        var mynewEl = angular.element( document.querySelector( newtext ) );
        mynewEl.addClass('custactive');
        getnewreport('week');
        // var piepostData = {"rid":resource_id,"filter":"today","week_id":wid,"dates":$scope.week_full};
      }else{
        $scope.myVar2 = true;
        $scope.myVar = false;
        $scope.myVar1 = false;
        var newtext= '#btn-month' ;
        var mynewEl = angular.element( document.querySelector( newtext ) );
        mynewEl.addClass('custactive');
        getnewreport('month');
        // var piepostData = {"rid":resource_id,"filter":"today","week_id":wid,"dates":$scope.month_full};
      }
      $scope.startdate = "";
      $scope.enddate = "";
      
      // UserService.getResourcePieData(piepostData)
      //        .then(function (response) {
      //        $scope.labels = response.data.label;
      //        $scope.doughdata = response.data.doughdata;
      //        $scope.totalutil = response.data.totalutil;

      //        });
      }



  $scope.open4 = function() {
    $scope.popup4.opened = true;
  };
  $scope.popup4={};





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
          $scope.accountsettings = {
            // smartButtonMaxItems: 1,
            scrollableHeight: '200px',
            scrollable: true,
            enableSearch: true,
            displayProp:'account_name',
            idProp:'id',
            externalIdProp:'',
            // selectionLimit: 1,
            closeOnSelect:true

          };
          $scope.servicesettings = {
            // smartButtonMaxItems: 1,
            scrollableHeight: '200px',
            scrollable: true,
            enableSearch: true,
            displayProp:'service_code',
            idProp:'id',
            externalIdProp:'',
            // selectionLimit: 1,
            showUncheckAll :false,
            closeOnSelect:true

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
            switcher('day');
            // $scope.myVar = true;
            // $scope.myVar1 = false;
            // $scope.myVar2 = false;



   // getreportdata("today").then(function(response){
   //      $scope.knobvalue = response.util;
   //      $scope.total_hrs = response.total_hrs;
   //      $scope.util_hrs = response.util_hrs;
   //     var data = $scope.repdata = response.donut;
   //          $scope.gridOptions.data = data;
   //          });    

   }
          
          
              
           function getManagers(){
              UserService.getManagers()
                           .then(function (response) {
                  $scope.managerdata = response.data.success;
                  });
           }
           getManagers();
           function getResources(){
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
           }
           getResources();
            function getActualResources(){
              $scope.manstr = '';
              var manstr = [];
              angular.forEach($scope.managermodel, function (obj) {
                     manstr.push(obj.employee_name);
                                
                                 // newserv.push(vm.ser[obj.id]);
                          });
              $scope.manstr = manstr.join();


              if($scope.managermodel.length != 0){
                UserService.resourcesUnderManager($scope.managermodel)
                           .then( function (response) {
                  // $scope.peopledata=response.data.success;
                  // $scope.peoplemodel=response.data.success;
                  myFunc();
                            });

              }else{
                getResources();
                myFunc();
              }
            }
            function getActualServices(item){
              $scope.accstr = '';
              var accstr = [];
              angular.forEach($scope.accountmodel, function (obj) {
                    accstr.push(obj.account_name);
                                
                                 // newserv.push(vm.ser[obj.id]);
                          });
               $scope.accstr = accstr.join();


              if($scope.accountmodel.length == 1){

                // UserService.getAccountServices($scope.accountmodel)
                //            .then( function (response) {
                //   $scope.servicedata=response.data.success;
                //   myFunc();
                //             });

                UserService.getAccountServices($scope.accountmodel[0].id).then(function (response){
                  $scope.servicedata = response.data.service_id ;
                  var filtered = [];
                  angular.forEach($scope.servicedata, function(item) {
                    filtered.push(item);
                  });
                  filtered.sort(function (a, b) {
                    return (a.service_code > b.service_code? 1 : -1);
                  });
                  $scope.servicedata=filtered;

                });

                $scope.showservice=1;
                myFunc();

               }
              else{
                $scope.showservice=0;
                myFunc();
              }
            }
            function fetchreport(filter){
              getreportdata(filter).then(function(response){
                      $scope.knobvalue = response.util;
                      $scope.total_hrs = response.total_hrs;
                      $scope.util_hrs = response.util_hrs;
                     var data = $scope.repdata = response.donut;
                          $scope.gridOptions.data = data;
                          $scope.getArray.length = 0;
                          $scope.getArrayRaw.length = 0;
                           $scope.getArrayRaw = response.timedata;
                           $scope.getArray = response.timeaggData;
                          // angular.forEach(data, function (obj) {
                          //   var empdata = {};
                          //   empdata.Name = obj.name;
                          //   empdata.EmployeeId = obj.emp_id;
                          //   empdata.Hours = obj.hours;
                          //   empdata.Split = obj.spark.label.join();
                          //   empdata.Percentage = obj.perc;
                          //   // empdata.Color = obj.colour;
                          //   $scope.getArray.push(empdata);
                          // });

                          });

            }
          

            $scope.managerEvents = {
             onItemSelect: function(item) {
              $scope.people=item;
              $scope.peoplemodel.length = 0;
              

              getActualResources();
             },
             onItemDeselect: function(item) {
              $scope.peoplemodel.length = 0;
              
              getActualResources();
            },
             onDeselectAll: function() {
              $scope.peoplemodel.length = 0;
              $scope.managermodel.length = 0;
              
              getActualResources();
          },
           };
           $scope.peopleEvents = {
             onItemSelect: function(item) {
              
              myFunc();
             },
             onItemDeselect: function(item) {
              
                myFunc();
            },
            onDeselectAll: function() {
              
                myFunc();
          },
           };
           $scope.accountEvents = {
             onItemSelect: function(item) {
                $scope.servicemodel.length = 0 ;
                
                getActualServices(item);
                
             },
             onItemDeselect: function(item) {
              $scope.servicemodel.length = 0 ;
                
                getActualServices(item);
            },
            onDeselectAll: function() {
                $scope.servicemodel.length = 0 ;
                
                getActualServices(item);
          },
           };
           $scope.serviceEvents = {
             onItemSelect: function(item) {
                
                myFunc();
             },
             onItemDeselect: function(item) {
                
                myFunc();
            },
            onDeselectAll: function() {
                
                myFunc();
          },
           }
    /**
     * filter the list of people to be displayed on the grid
     * @return {[type]}
     */
       

    function myFunc() {
      $scope.serstr = '';
      var serstr =[];

              angular.forEach($scope.servicemodel, function (obj) {
                    serstr.push(obj.service_code);
                                
                                 // newserv.push(vm.ser[obj.id]);
                          });
              $scope.serstr = serstr.join();

    if($scope.startdate && $scope.enddate){
    var start = $scope.startdate;
    var end =  $scope.enddate;
    $scope.dateArray = [];
    $scope.currentstartDate = moment(start);
    $scope.startDate = angular.copy($scope.currentstartDate);
    $scope.endDate = moment(end);
     
    while ($scope.endDate >= $scope.currentstartDate) {
        $scope.dateArray.push($scope.currentstartDate.format("YYYY-MM-DD"));
        $scope.currentstartDate = $scope.currentstartDate.add(1, 'days');
    }
    
              fetchreport("currentDate");
              }else{
                fetchreport("today");
              }
};



  function myprevFunc() {
    $scope.resultDate = moment(); 
    $scope.resultDate = $scope.resultDate.subtract(1, "days").format("YYYY-MM-DD");
    getreportdata("previousDay").then(function(response){
                $scope.knobvalue = response.util;
                $scope.total_hrs = response.total_hrs;
                $scope.util_hrs = response.util_hrs;
                var data = $scope.repdata = response.donut;
                    $scope.gridOptions.data = data;
                    $scope.getArray.length = 0;
                    $scope.getArrayRaw.length = 0;
                    $scope.getArrayRaw = response.timedata;
                    $scope.getArray = response.timeaggData;
                    // angular.forEach(data, function (obj) {
                    //         var empdata = {};
                    //         empdata.Name = obj.name;
                    //         empdata.EmployeeId = obj.emp_id;
                    //         empdata.Hours = obj.hours;
                    //         empdata.Split = obj.spark.label.join();
                    //         empdata.Percentage = obj.perc;
                    //         // empdata.Color = obj.color;
                    //         $scope.getArray.push(empdata);
                    //       });
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
                    $scope.getArray.length = 0;
                    $scope.getArrayRaw.length = 0;
                    $scope.getArrayRaw = response.timedata;
                    // angular.forEach(data, function (obj) {
                    //         var empdata = {};
                    //         empdata.Name = obj.name;
                    //         empdata.EmployeeId = obj.emp_id;
                    //         empdata.Hours = obj.hours;
                    //         empdata.Split = obj.spark.label.join();
                    //         empdata.Percentage = obj.perc;
                    //         // empdata.Color = obj.color;
                    //         $scope.getArray.push(empdata);
                    //       });
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
                    $scope.getArray.length = 0;
                    $scope.getArrayRaw.length = 0;
                    $scope.getArrayRaw = response.timedata;
                    $scope.getArray = response.timeaggData;
                    // angular.forEach(data, function (obj) {
                    //         var empdata = {};
                    //         empdata.Name = obj.name;
                    //         empdata.EmployeeId = obj.emp_id;
                    //         empdata.Hours = obj.hours;
                    //         empdata.Split = obj.spark.label.join();
                    //         empdata.Percentage = obj.perc;
                    //         // empdata.Color = obj.color;
                    //         $scope.getArray.push(empdata);
                    //       });
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
      $scope.getArray.length = 0;
      $scope.getArrayRaw.length = 0;
      $scope.getArrayRaw = response.timedata;
      $scope.getArray = response.timeaggData;
      // angular.forEach(data, function (obj) {
      //                       var empdata = {};
      //                       empdata.Name = obj.name;
      //                       empdata.EmployeeId = obj.emp_id;
      //                       empdata.Hours = obj.hours;
      //                       empdata.Split = obj.spark.label.join();
      //                       empdata.Percentage = obj.perc;
      //                       // empdata.Color = obj.color;
      //                       $scope.getArray.push(empdata);
      //                     });
      });
   }
  $scope.mousedleave = function() {
  $scope.popoverIsVisible = false; 
};



var startdateFormat='YYYY-MM-DD';
var enddateFormat='YYYY-MM-DD';


// function getDates() {
//   var start = $scope.startdate;
//   var end =  $scope.enddate;
//   var dateArray = [];
//    var currentDate = moment(start);
//      var endDate = moment(end);
     
//     while (endDate >= currentDate) {
//         dateArray.push(currentDate.format("YYYY-MM-DD"));
//         currentDate = currentDate.add(1, 'days');
//         console.log(currentDate);

//     }
//     console.log(dateArray);
//     return dateArray;
// }


       
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
$scope.resultDate = moment(); 
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
          $scope.prevmonth_full=[];
            var monthday = moment( $scope.prevMonth);
            var month = monthday.month();
               while(month === monthday.month()){
              $scope.prevmonth_full.push(monthday.format(fullWeekFormat));
               monthday = monthday.add(1,'days');
             }



            var nexttMonth =[];
           $scope.nexttMonth = new moment().add(1, 'months').date(1).format('YYYY-MM-DD');
          $scope.nextmonth_full=[];
            var monthday = moment( $scope.nexttMonth);
            var month = monthday.month();
               while(month === monthday.month()){
              $scope.nextmonth_full.push(monthday.format(fullWeekFormat));
               monthday = monthday.add(1,'days');
             }


























var getreportdata = function (filter) {

  $scope.csvFileName = '';
  
  var deferred = $q.defer();
    if($scope.peoplemodel.length){
      var pdata = $scope.peoplemodel;
      // var resArray = [];
      // angular.forEach($scope.peoplemodel, function (obj) {
      //                       resArray.push(obj.employee_name);
      //                     });
      // $scope.csvFileName = resArray.join();
    }else{
      // var pdata = $scope.peopledata;
      var pdata = [];
      // $scope.csvFileName = "All_Resources";
    }
    if($scope.managermodel.length){
      var mdata = $scope.managermodel;
    }else{
      // var pdata = $scope.peopledata;
      var mdata = [];
    }
    if($scope.accountmodel.length){
      var adata = $scope.accountmodel;
      // var resArray = [];
      // angular.forEach($scope.accountmodel, function (obj) {
      //                       resArray.push(obj.account_name);
      //                     });
      // $scope.csvFileName = $scope.csvFileName +"_" + resArray.join();
    }else{
      // var adata = $scope.accountdata;
      var adata = [];
      // $scope.csvFileName = $scope.csvFileName +"_" + "All_Accounts";
    }
    if($scope.accountmodel.length == 1){
      var sdata = $scope.servicemodel;
      var resArray = [];
      // angular.forEach($scope.servicemodel, function (obj) {
      //                       resArray.push(obj.service_code);
      //                     });
      // $scope.csvFileName = $scope.csvFileName +"_" + resArray.join();

    }else{
      var sdata = [];
      // $scope.csvFileName = $scope.csvFileName +"_" + "All_Services";
    }
      var date = $scope.resultDate.format(fullWeekFormat);
      if(filter=="today"){
        

        $scope.resultDate = moment();
        $scope.formattedDate = $scope.resultDate.format(fullWeekFormat);
        // $scope.csvFileName = $scope.csvFileName +"_" + $scope.formattedDate;
        var piepostData = {"dates":[$scope.formattedDate],"resource":pdata,"account":adata,"service":sdata,"manager":mdata};
        }else if(filter=="currentDate"){
          // $scope.csvFileName = $scope.csvFileName +"_" + $scope.dateArray.join();
        var piepostData = {"dates":$scope.dateArray,"resource":pdata,"account":adata,"service":sdata,"manager":mdata};
        }else if(filter=="prevDay"){
          $scope.resultDate = $scope.resultDate.subtract(1, "days");
          $scope.formattedDate = $scope.resultDate.format(fullWeekFormat);
          // $scope.csvFileName = $scope.csvFileName +"_" + $scope.formattedDate;
         var piepostData = {"dates":[ $scope.formattedDate],"resource":pdata,"account":adata,"service":sdata,"manager":mdata};
          $scope.resultDate = $scope.resultDate.add(1, "days");
          $scope.formattedDate = $scope.resultDate.format(fullWeekFormat);
          // $scope.csvFileName = $scope.csvFileName +"_" + $scope.formattedDate;
         var piepostData = {"dates":[ $scope.formattedDate],"resource":pdata,"account":adata,"service":sdata,"manager":mdata};
         }else if(filter=="week"){
          $scope.resultDate = moment();
          // $scope.csvFileName = $scope.csvFileName +"_" + $scope.week_full[0]+"-"+$scope.week_full[$scope.week_full.length-1];
          var piepostData = {"dates":$scope.week_full,"resource":pdata,"account":adata,"service":sdata,"manager":mdata};
        }else if(filter=="previousWeek"){
          $scope.resultDate = $scope.resultDate.subtract(1, "weeks");
          var prevWeek = $scope.resultDate.startOf('isoWeek');
          $scope.prevweek_full=[prevWeek.day(0).format(fullWeekFormat),prevWeek.day(1).format(fullWeekFormat),prevWeek.day(2).format(fullWeekFormat),prevWeek.day(3).format(fullWeekFormat),prevWeek.day(4).format(fullWeekFormat),prevWeek.day(5).format(fullWeekFormat),prevWeek.day(6).format(fullWeekFormat)];
          // $scope.csvFileName = $scope.csvFileName +"_" + $scope.prevweek_full[0]+"-"+$scope.prevweek_full[$scope.prevweek_full.length-1];
          var piepostData = {"dates":$scope.prevweek_full,"resource":pdata,"account":adata,"service":sdata,"manager":mdata};
        }else if(filter=="nextWeek"){
          // $scope.resultDate = moment();
          $scope.resultDate = $scope.resultDate.add(1, "weeks");
          var nextWeek = $scope.resultDate.startOf('isoWeek');
          $scope.nextweek_full=[nextWeek.day(0).format(fullWeekFormat),nextWeek.day(1).format(fullWeekFormat),nextWeek.day(2).format(fullWeekFormat),nextWeek.day(3).format(fullWeekFormat),nextWeek.day(4).format(fullWeekFormat),nextWeek.day(5).format(fullWeekFormat),nextWeek.day(6).format(fullWeekFormat)];
          // $scope.csvFileName = $scope.csvFileName +"_" + $scope.nextweek_full[0]+"-"+$scope.nextweek_full[$scope.nextweek_full.length-1];
          var piepostData = {"dates":$scope.nextweek_full,"resource":pdata,"account":adata,"service":sdata,"manager":mdata};
        }else if(filter=="month"){
          $scope.resultDate = moment();
          // $scope.csvFileName = $scope.csvFileName +"_" + $scope.month_full[0]+"-"+$scope.month_full[$scope.month_full.length-1];
          var piepostData = {"dates":$scope.month_full,"resource":pdata,"account":adata,"service":sdata,"manager":mdata};
        }else if(filter=="previousMonth"){

            // var prevMonth =[];
            $scope.resultDate = $scope.resultDate.subtract(1, 'months');
            $scope.prevMonth = $scope.resultDate.date(1).format(fullWeekFormat);
            $scope.prevmonth_full=[];
            var monthday = moment($scope.prevMonth);
            var month = monthday.month();
            while(month === monthday.month()){
              $scope.prevmonth_full.push(monthday.format(fullWeekFormat));
               monthday = monthday.add(1,'days');
             }
             // $scope.csvFileName = $scope.csvFileName +"_" + $scope.prevmonth_full[0]+"-"+$scope.prevmonth_full[$scope.prevmonth_full.length-1];

        var piepostData = {"dates":$scope.prevmonth_full,"resource":pdata,"account":adata,"service":sdata,"manager":mdata};
      }else {

           // var nexttMonth =[];
           $scope.resultDate = $scope.resultDate.add(1, 'months');
           $scope.nexttMonth = $scope.resultDate.date(1).format(fullWeekFormat);
           console.log($scope.nexttMonth)
           $scope.nextmonth_full=[];
           var monthday = moment($scope.nexttMonth);
           var month = monthday.month();
           while(month === monthday.month()){
              $scope.nextmonth_full.push(monthday.format(fullWeekFormat));
               monthday = monthday.add(1,'days');
             }
             // $scope.csvFileName = $scope.csvFileName +"_" + $scope.nextmonth_full[0]+"-"+$scope.nextmonth_full[$scope.nextmonth_full.length-1];
        var piepostData = {"dates":$scope.nextmonth_full,"resource":pdata,"account":adata,"service":sdata,"manager":mdata};
      }
      if(piepostData.dates.length > 1){
        $scope.csvFileName = "PMO_Utilization_Export_" + piepostData.dates[0] + "_" + piepostData.dates[piepostData.dates.length-1];
      }else{
        $scope.csvFileName = "PMO_Utilization_Export_" + piepostData.dates[0];
      }
      // $scope.rawcsvFileName = "Raw_"+$scope.csvFileName ;


       UserService.getReportData(piepostData)
             .then(function (response) {
              $scope.repdata =   response.data.donut;
             deferred.resolve(response.data);
             });
      return deferred.promise;
      }

$scope.hidePopover = function () {
  $scope.popoverIsVisible = false;
};
	$scope.gridOptions.rowHeight=50;
  if($scope.manstr){
    $scope.newmanstr = "Reporting Manager  : " + $scope.manstr;  
  }
  if($scope.accstr){
    $scope.newaccstr = "Accounts  : " + $scope.accstr;
  }
  if($scope.serstr){
    $scope.newserstr = "Services  : " + $scope.serstr;
  }
  
  
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
      $scope.getArray.length = 0;
      $scope.getArrayRaw.length = 0;
      $scope.getArrayRaw = response.timedata;
      $scope.getArray = response.timeaggData;
      // angular.forEach(data, function (obj) {
      //                       var empdata = {};
      //                       empdata.Name = obj.name;
      //                       empdata.EmployeeId = obj.emp_id;
      //                       empdata.Hours = obj.hours;
      //                       empdata.Split = obj.spark.label.join();
      //                       empdata.Percentage = obj.perc;
      //                       // empdata.Color = obj.color;
      //                       $scope.getArray.push(empdata);
      //                     });
      });

        }
 
    }
})();

