(function () {
    'use strict';

    angular
        .module('app')
        .controller('TimeSheetController', TimeSheetController);

    TimeSheetController.$inject = ['$filter','$rootScope','$cookieStore','$scope','$state','$http','UserService','$location'];
    function TimeSheetController($filter,$rootScope,$cookieStore,$scope,$state,$http,UserService,$location) {
        var vm = this;
        var w_start;
        var w_end;
        var w_today=moment();
        var initital = 0;
        var apiflag=0;
        vm.savetimesheet = savetimesheet;
        vm.getpiedata = getpiedata;
        var text_disable='true';
        $scope.userData=[];
        $scope.hov=[];
$scope.hovering =  function(p){
  if($scope.hov[p.account_id] == undefined)
    $scope.hov[p.account_id] = [];
  if($scope.hov[p.account_id][p.service_id] == undefined)
    $scope.hov[p.account_id][p.service_id] = [];
  if($scope.hov[p.account_id][p.service_id][p.project_id] == undefined)
    $scope.hov[p.account_id][p.service_id][p.project_id] = 0;

    $scope.hov[p.account_id][p.service_id][p.project_id] = 1;
}
$scope.remhovering =  function(p){
 
    $scope.hov[p.account_id][p.service_id][p.project_id] = 0;
}
        $scope.colors = [ '#fdb45c', '#00ADF9', '#f7464a', '#46BFBD', '#32cd32', '#28022f', '#feca9a'];
        $scope.weeknames = [ ".fc-sun",".fc-mon",".fc-tue", ".fc-wed", ".fc-thu", ".fc-fri", ".fc-sat"];
        var currentDate,
          next,
          count,
          countPrev,
          weekStart,
          weekEnd,
          monthFormat='MMM',
          yearFormat='YYYY',
          shortWeekFormat = 'ddd D',
          fullWeekFormat='YYYY-MM-DD',
          weekYear='YYYY-WW';
          $scope.dateArray=[];
          $scope.projectHours={};
          $scope.master = [{}];
          var weekFullStart = moment().clone().startOf('week');
          $scope.week_full=[weekFullStart.day(0).format(fullWeekFormat),weekFullStart.day(1).format(fullWeekFormat),weekFullStart.day(2).format(fullWeekFormat),weekFullStart.day(3).format(fullWeekFormat),weekFullStart.day(4).format(fullWeekFormat),weekFullStart.day(5).format(fullWeekFormat),weekFullStart.day(6).format(fullWeekFormat)];
          
          $scope.fromDB=[{}];
          $scope.exists=0;
          $scope.userinDB=0;
          $scope.days=[0,1,2,3,4,5,6];
         $scope.options = [{id: 1, name: 'Opened','disabled': false}, {id: 2, name: 'In progress','disabled': false}, {id: 3, name: 'Completed','disabled': false}, {id: 4, name: 'Closed','disabled': true}];
         $scope.projects =[]; 
         currentDate  = moment();
    var c_time=0;
      $rootScope.bgClass = function() {
        var splits=$location.url().toString().split("/");
        var urllast=splits[splits.length - 1];
        if(urllast == "timesheet"){
        return 'bod-bac';
        }else{
        return 'oth-bac';  
        }
      };
      $scope.getTotal = function(index){
            var total = 0;
            for(var i = 0; i < $scope.projects.length; i++){
                var tem = $scope.projects[i].temp[index];
                total += tem;
            }
            return total;
        }
      $scope.eventRender = function( event, element, view ) {
        $compile(element)($scope);
      };
      $scope.buttonEvent = function( event) {
        
        $('#timecalendar').fullCalendar(event);

            if(event=="next"){
              weekDates(w_today.add(7,'days'));
            }
            else if(event=="prev"){
               weekDates(w_today.subtract(7,'days'));
            }
            else{
            }
       
       
        for(var j=0;j<$scope.projects.length;j++){
                for(var i=0;i<$scope.days.length;i++){
                  console.log('start if'+w_start.day(i).format('ddd D'));
                      $scope.temp_arr=[];
                     /*if(weekStart.day(i).format('ddd')=='Sun' || weekStart.day(i).format('ddd')=='Sat')*/
                     if(moment(w_start.day(i).format('YYYY-MM-DD')).isAfter(moment().format('YYYY-MM-DD'))){
                       $scope.projects[j].bool[i]=true;
                       $scope.temp_arr[i]='';
                     }
                     else{
                       $scope.projects[j].bool[i]=false;
                       $scope.temp_arr[i]='';
                     }
                }
                
              }
         savetimesheet('event');
         getpiedata("today");
      };
      
  
       var name = $rootScope.globals.currentUser.username;
       var uid = $rootScope.globals.currentUser.userId;
       var resource_id = $rootScope.globals.currentUser.resource_id;
       $rootScope.currentUser={
       "Name":name,
        "user_id":uid,
         "resource_id":resource_id 
       };
   $rootScope.shownav=true;
	 $rootScope.rootAccess =  $cookieStore.get("rootAccess");
    $rootScope.pmAccess =  $cookieStore.get("pmAccess");
    var prevstart = '';
      UserService.getAllResourceProjects(resource_id)
         .then(function (response) {
                var data = response.data;
                $scope.projects = data;
                weekStart = currentDate.clone().startOf('week'),
                weekEnd =   currentDate.clone().endOf('week');
                for(var j=0;j<$scope.projects.length;j++){
                for(var i=0;i<$scope.days.length;i++){
                      $scope.temp_arr=[];
                     /*if(weekStart.day(i).format('ddd')=='Sun' || weekStart.day(i).format('ddd')=='Sat')*/
                     if(moment(weekStart.day(i).format('YYYY-MM-DD')).isAfter(currentDate.format('YYYY-MM-DD'))){
                       $scope.projects[j].bool[i]=true;
                       $scope.temp_arr[i]='';
                     }
                     else{
                       $scope.projects[j].bool[i]=false;
                       $scope.temp_arr[i]='';
                     }
                }
               // $scope.projects[j].comments="";
              }
              
              setCurrentDate(currentDate,0,currentDate.format(weekYear),"");
              apiflag=1;
             getpiedata("today");
                
             });

     function getpiedata(filter) {
      var text= '#btn-pie-group button' ;
        var myEl = angular.element( document.querySelectorAll( text ) ); 
        myEl.removeClass('custactive');
      var wid=moment().format(weekYear);
      var date = moment().format(fullWeekFormat);
      if(filter=="today"){
        var newtext= '#btn-today' ;
        var mynewEl = angular.element( document.querySelector( newtext ) );
        mynewEl.addClass('custactive');
        var piepostData = {"rid":resource_id,"filter":"today","week_id":wid,"dates":[date]};
        
      }else if(filter=="week"){
        var newtext= '#btn-week' ;
        var mynewEl = angular.element( document.querySelector( newtext ) );
        mynewEl.addClass('custactive');
        var piepostData = {"rid":resource_id,"filter":"today","week_id":wid,"dates":$scope.week_full};
      }else{
        var newtext= '#btn-month' ;
        var mynewEl = angular.element( document.querySelector( newtext ) );
        mynewEl.addClass('custactive');
        var piepostData = {"rid":resource_id,"filter":"today","week_id":wid,"dates":$scope.month_full};
      }
      
      UserService.getResourcePieData(piepostData)
             .then(function (response) {
             $scope.labels = response.data.label;
             $scope.doughdata = response.data.doughdata;
             $scope.totalutil = response.data.totalutil;

             });
      }
   $scope.eventSources = [fetchEvents];

   function weekDates(aMoment,c_moment){

        w_today=aMoment;
        w_start = w_today.clone().startOf('week');
        w_start = w_today.clone().endOf('week');  
      
   }

    function fetchEvents(start, end, timezone, callback) {
      
      var startdate=$('#timecalendar').fullCalendar('getView').start.format('x');
      var enddate = ($('#timecalendar').fullCalendar('getView').end.format('x'));
      var num = Number(enddate)/1000;
      var newnum = Number(startdate)/1000;
      var wkid=moment.unix(num).format(weekYear);
      var wid=moment().format(weekYear);
      var wday = moment().day();
      var myEl = angular.element( document.querySelector( $scope.weeknames[wday] ) );
      if(myEl.data("date")==moment().format(fullWeekFormat)){
        myEl.css('background-color','#ffff00');
      }
         if(apiflag){
            if(wkid == wid){
                setCurrentDate(currentDate,0,wkid,newnum);
            }else{
              if(prevstart > startdate){
                countPrev=0;
                count=count-1;
                $scope.PrevInd.push(count);
                setCurrentDate(currentDate.subtract(7,'days'),count,wkid,newnum);
              }else{
                count=count+1;
                setCurrentDate(currentDate.add(7,'days'),count,wkid,newnum);
              }
              // savetimesheet();
            }
        }
      initital++;

      prevstart = startdate;
     //getpiedata("week");

    }
   // $('#timecalendar').fullCalendar.formatDate(calEvent.start, 'dd/MM/yyyy HH:mm');
   $scope.uiConfig = {
        calendar:{
          // height: 750,
          editable: false,
          header:{
            left: 'title',
            center: '',
            right: 'today prev,next'
          },
          eventBackgroundColor: "#000000",
          defaultView: "basicWeek",
          //eventRender: $scope.eventRender,


          columnFormat: {
		        month: 'MMMM yyyy',                            // September 2009
		        week: "ddd D ", // Sep 7 - 13 2009
		        day: 'dddd, MMM d, yyyy'                       // Tuesday, Sep 8, 2009
		    },
          dayRender: function( date, cell ) { 
			    var view = $('#timecalendar').fullCalendar('getView');
			    if (view.name == 'basicWeek') {
			        $('.fc-body').hide();
              $('.fc-prev-button').hide();
              $('.fc-next-button').hide();
              $('.fc-today-button').hide();
              if(cell.hasClass('fc-today')){
                cell.css("background-color", "red");
              }
               var pres = moment();
               if(pres === moment(date)){
                cell.css("background-color", "red");
               }
              // 
			    }
			},
          eventLimit: true, 
          weekends: true,
          views: {
            agenda: {
              eventLimit: 4 // adjust to 6 only for agendaWeek/agendaDay
            }
          }
        }
      };
   
    
    


    function setCurrentDate(aMoment,c,wkid,num){
      // var wkid=aMoment.format(weekYear);
     // var wid=moment().format(weekYear);
            var Data = { "week_id":wkid,"user":$rootScope.currentUser};
            UserService.getResourceTimeCard(Data)
                 .then(function (response) {
                  var resData = response.data;
                    for(var i=0;i<resData.length;i++){
                      if(resData[i].userid==uid){
                        console.log(resData[i])
                         $scope.exists=1;
                         $scope.userinDB=1;
                         $scope.fromDB=resData[i].timecard;

                         $scope.comments=resData[i].comments[0];
                            if(resData[i].timecard.length>1){
                                $scope.exists=2;
                            }
                      }
                    }
                    // setCurrentDate(moment(),0);
            
      count=c;
      currentDate = aMoment,
      weekStart = currentDate.clone().startOf('week'),
      weekEnd = currentDate.clone().endOf('week'),
      $scope.month=currentDate.format(monthFormat);
      $scope.year=currentDate.format(yearFormat);
      $scope.weekYear=wkid;
      $scope.today=[weekStart.day(0).format(shortWeekFormat),weekStart.day(1).format(shortWeekFormat),weekStart.day(2).format(shortWeekFormat),weekStart.day(3).format(shortWeekFormat),weekStart.day(4).format(shortWeekFormat),weekStart.day(5).format(shortWeekFormat),weekStart.day(6).format(shortWeekFormat)];
      $scope.today_full=[weekStart.day(0).format(fullWeekFormat),weekStart.day(1).format(fullWeekFormat),weekStart.day(2).format(fullWeekFormat),weekStart.day(3).format(fullWeekFormat),weekStart.day(4).format(fullWeekFormat),weekStart.day(5).format(fullWeekFormat),weekStart.day(6).format(fullWeekFormat)];
      // var weekFullStart = moment().clone().startOf('week');
      // $scope.week_full=[weekFullStart.day(0).format(fullWeekFormat),weekFullStart.day(1).format(fullWeekFormat),weekFullStart.day(2).format(fullWeekFormat),weekFullStart.day(3).format(fullWeekFormat),weekFullStart.day(4).format(fullWeekFormat),weekFullStart.day(5).format(fullWeekFormat),weekFullStart.day(6).format(fullWeekFormat)];
      $scope.temp_arr=[];
      $scope.month_full=[];
      if(num){
        var weekCurrStart = moment.unix(num).clone().startOf('week');
      }else{
        var weekCurrStart = weekStart;
      }
       
      $scope.curr_date= [weekCurrStart.day(0).format(fullWeekFormat),weekCurrStart.day(1).format(fullWeekFormat),weekCurrStart.day(2).format(fullWeekFormat),weekCurrStart.day(3).format(fullWeekFormat),weekCurrStart.day(4).format(fullWeekFormat),weekCurrStart.day(5).format(fullWeekFormat),weekCurrStart.day(6).format(fullWeekFormat)];
      var monthday = moment().startOf('month');
        var month = monthday.month();
        while(month === monthday.month()){
            $scope.month_full.push(monthday.format(fullWeekFormat));
            monthday = monthday.add(1,'days')
        }
      $scope.PrevInd=[];
      $scope.temp_obj={};
      var weekcount=0;
      $scope.userData=$scope.fromDB[0];
      var length = Object.keys($scope.userData).length;

            if(length){
              weekcount =1;
            }else{
              weekcount =0;
            }

      for(var j=0;j<$scope.projects.length;j++){
              $scope.projects[j].temp.length = 0;
            }
      for(var j=0;j<$scope.projects.length;j++){
         $scope.projects[j].InputValue.push($scope.temp_arr);
         //$scope.projects[j].temp=$scope.projects[j].InputValue[count];
         $scope.projects[j].temp = [0,0,0,0,0,0,0];
       if(weekcount>0){

               var arr = [];
          for (var key in $scope.userData) {
            if ($scope.userData.hasOwnProperty(key)) {
              if(key == $scope.projects[j].account_id){
                  for (var k in $scope.userData[key]) {
                      if(k == $scope.projects[j].service_id){
                          for (var l in $scope.userData[key][k]) {
                            if(l == $scope.projects[j].project_id){
                              arr.length=0;
                              for (var m in $scope.userData[key][k][l]) {
                                  arr.push($scope.userData[key][k][l][m]);
                              }
                               $scope.projects[j].temp.length = 0
                               $scope.projects[j].temp = angular.copy(arr);
                               $scope.projects[j].comments = $scope.comments[key][k][l];
                               console.log($scope.comments[key][k][l]);
                            }
                          }
                      }
                  }
              }
              arr.length=0;
            }
          }
        }else{
          $scope.projects[j].comments = "";
        }
               
     }
     });
    }

    

       function savetimesheet(val) {  
        console.log('value...'+val);
         $scope.master=angular.copy($scope.projects);
         for(var j=0;j<$scope.projects.length;j++){
          for(var i=0;i<$scope.projects[j].temp.length;i++){
            if($scope.projects[j].temp==null && $scope.projects[j].temp==" "){
                        $scope.projects[j].temp=0;
            }
          }
            
          $scope.projects[j].dayHours.length = 0;
          $scope.projects[j].dayHours.push({'day':$scope.curr_date,'Hours':$scope.projects[j].temp});
          }


        
          var postData = { "Exists":$scope.exists,"WeekID":$scope.weekYear,"user":$rootScope.currentUser,"projects":$scope.projects,'Dates':$scope.curr_date};
         // var postData = { };
          UserService.saveTimeCard(postData)
           .then(function (response) {
            if(val=="save"){
              $('#timecalendar').fullCalendar("today");
              vm.getpiedata('today');



            }
            // console.log(response);
              // $state.go("timesheet", {}, {reload: true});
           });
          
      //    $http
      //   .post('/addTimecard',{ "Exists":$scope.exists,"WeekID":$scope.weekYear,"user":$rootScope.currentUser,"projects":$scope.projects,'Dates':$scope.today_full})
      //   .success(function(data){
      //     console.log('in posting..'+$scope.weekYear+'...exis'+$scope.exists+'....'+$scope.projects[0].temp);
      //       //what to do here? it's up to you and the data you write from server.
      //   })
      //   .error(function(data){
      //       console.log('Error: ' + data);
      //   });
       };
        

        
    }

})();