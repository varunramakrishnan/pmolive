  (function () {
    'use strict';

    angular
    .module('app')
    .controller('HomeController', HomeController);

    HomeController.$inject = ['UserService','$timeout','$cookieStore','$scope', '$rootScope','$compile','uiCalendarConfig'];
    function HomeController(UserService,$timeout,$cookieStore,$scope, $rootScope,$compile,uiCalendarConfig) {
          //

          var date = new Date();
          $rootScope.shownav=true;
          $rootScope.rootAccess =  $cookieStore.get("rootAccess");
          $rootScope.pmAccess =  $cookieStore.get("pmAccess");
          var d = date.getDate();
          var m = date.getMonth();
          var y = date.getFullYear();
          $scope.type = "free";
          $scope.changeTo = 'Hungarian';
            $scope.accountmodel = [];
            $scope.sermodel = [];
            $scope.skillmodel = [];
            $scope.eventSources = [fetchEvents];

            function fetchEvents(start, end, timezone, callback) {
              var aid = "";
              if(!($scope.accountmodel.length) && !($scope.skillmodel.length) && !($scope.resourcemodel.length)){
                $scope.type = "free";
              }
              if($scope.type=="filter"){
                      var newAccEvents=[];
                      var newEvents=[];
                      angular.forEach($scope.accountmodel, function (obj) {
                         newAccEvents.push(obj.id);
                       });
                      var newSerEvents=[];
                      var newSeEvents=[];
                      angular.forEach($scope.sermodel, function (obj) {
                         newSerEvents.push(obj.id);
                       });
                      var newSkillEvents=[];
                      var newSkEvents=[];
                      angular.forEach($scope.skillmodel, function (obj) {
                         newSkillEvents.push(obj.id);
                       });
                      var newResourceEvents=[];
                      angular.forEach($scope.resourcemodel, function (obj) {
                         newResourceEvents.push(obj.id);
                       });
                      if($scope.accountmodel.length > 1){
                        newSerEvents.length = 0;
                        $scope.sermodel.length = 0;
                      }
                var startdate=$('#mycalendar').fullCalendar('getView').start.format('x');
                var enddate = ($('#mycalendar').fullCalendar('getView').end.format('x'));
                   UserService.getNewDates({"accounts":newAccEvents.join(),"services":newSerEvents.join(),"skills":newSkillEvents.join(),"resources":newResourceEvents.join(),'startdate':startdate,'enddate':enddate}).then(function (response) {
                          angular.forEach(response.data, function (object) {
                             newEvents.push({
                              title: object.title,
                              start: new Date(Number(object.start)+19800),
                              allDay: true,
                              description: object.description,
                              type: object.type,
                              perc: object.perc,
                            });
                     });
                        angular.copy(newEvents, $scope.events);
                        callback($scope.events);
                        });
              }else if($scope.type=="free"){
                var startdate=$('#mycalendar').fullCalendar('getView').start.format('x');
                var enddate = ($('#mycalendar').fullCalendar('getView').end.format('x'));
                var reqdate= {'startdate':startdate,'enddate':enddate};
                var newFreeEvents=[];
                UserService.getFreeResourceDates(reqdate).then(function (response) {
                          angular.forEach(response.data, function (object) {
                             newFreeEvents.push({
                              title: object.title,
                              start: new Date(Number(object.start)),
                              allDay: true,
                              description:"",
                            });
                     });
                        angular.copy(newFreeEvents, $scope.events);
                        callback($scope.events);
              //$scope.accountdata = response.data;
                        });

              }
              
            
           }                        
           $scope.events = [

           ] ;
           $scope.eventsF = function (start, end, timezone, callback) {
            var s = new Date(start).getTime() / 1000;
            var e = new Date(end).getTime() / 1000;
            var m = new Date(start).getMonth();
            var events = [{title: 'Feed Me ' + m,start: s + (50000),end: s + (100000),allDay: false, className: ['customFeed']}];
            callback(events);
          };

          $scope.calEventsExt = {
           color: '#f00',
           textColor: 'yellow',
           events: [ 
           {type:'party',title: 'Lunch',start: new Date(y, m, d, 12, 0),end: new Date(y, m, d, 14, 0),allDay: false},
           {type:'party',title: 'Lunch 2',start: new Date(y, m, d, 12, 0),end: new Date(y, m, d, 14, 0),allDay: false},
           {type:'party',title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/'}
           ]
         };
         $scope.alertOnEventClick = function( date, jsEvent, view){
          $scope.alertMessage = (date.title + ' was clicked ');
        };
        $scope.alertOnDrop = function(event, delta, revertFunc, jsEvent, ui, view){
         $scope.alertMessage = ('Event Droped to make dayDelta ' + delta);
       };
       $scope.alertOnResize = function(event, delta, revertFunc, jsEvent, ui, view ){
         $scope.alertMessage = ('Event Resized to make dayDelta ' + delta);
       };
       $scope.addRemoveEventSource = function(sources,source) {
        var canAdd = 0;
        angular.forEach(sources,function(value, key){
          if(sources[key] === source){
            sources.splice(key,1);
            canAdd = 1;
          }
        });
        if(canAdd === 0){
          sources.push(source);
        }
      };


      $scope.removeEventSource = function(source) {
        angular.forEach(source,function(value, key){
            source.splice(key,1);
        });
      };
      $scope.getRes = function() {

        
       
        

                          
              //$scope.accountdata = response.data;
      }
      $scope.getSki = function() {

        
        

                          
              //$scope.accountdata = response.data;
      }

      // add custom event
      $scope.addEvent = function() {
        $scope.events.push({
          title: 'Open Sesame',
          start: new Date(y, m, 28),
          //end: new Date(y, m, 29),
          //className: ['openSesame']
        });
        /*$timeout(function () {
         UserService.getAccountResource(2)
                           .then(function (response) {
                           for(var i = 0; i < response.data.length; i++) {
                              var obj = response.data[i];
                              $scope.events.push({
                                  title: obj.title,
                                  start: new Date(Number(obj.start)),
                              });
                           }
                           });
  console.log($scope.events);
  },3000);*/

  };
      // remove event 
      $scope.remove = function(index) {
        $scope.events.splice(index,1);
      };
      $scope.removeAll = function() {
        $scope.events.splice(0,$scope.events.length);
      };
      // Change View 
      $scope.changeView = function(view,calendar) {
        uiCalendarConfig.calendars[calendar].fullCalendar('changeView',view);
      };
      // Change View 
      $scope.renderCalender = function(calendar) {
        if(uiCalendarConfig.calendars[calendar]){
          uiCalendarConfig.calendars[calendar].fullCalendar('render');
        }
      };
       // Render Tooltip 
       $scope.eventRender = function( event, element, view ) {
          if($scope.type=="free"){
          var s="background-color:#378006;border-color:#378006";
        }else{
          if (event.type=="free") {
          if((event.perc === "100.0") || (event.perc === "100")){
            var s="background-color:#378006;border-color:#378006";
            }else{
              var s="background-color:#e26a26;border-color:#e26a26";
            }
          } else{
              var s="background-color:#8B4513;border-color:#8B4513";
          };
        }
        element.attr({
          // 'tooltip': event.description.split("|").join('\n'),
          'tooltip': event.description.split("|").join(','),
          'style':s,
         'tooltip-append-to-body': true,
          'eventColor': '#378006'});
        $compile(element)($scope);
      };
      // config object 
      $scope.uiConfig = {
        calendar:{
          height: 750,
          editable: false,
          header:{
            left: 'title',
            center: '',
            right: 'today prev,next'
          },
          eventBackgroundColor: "#000000",
          eventClick: $scope.alertOnEventClick,
          eventDrop: $scope.alertOnDrop,
          eventResize: $scope.alertOnResize,
          eventRender: $scope.eventRender,
          eventLimit: true, 
          weekends: false,
          views: {
            agenda: {
              // eventLimit: 2 // adjust to 6 only for agendaWeek/agendaDay
              eventLimit: 4 // adjust to 6 only for agendaWeek/agendaDay
            }
          }
        }
      };

      $scope.changeLang = function() {
        if($scope.changeTo === 'Hungarian'){
          $scope.uiConfig.calendar.dayNames = ["Vasárnap", "Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat"];
          $scope.uiConfig.calendar.dayNamesShort = ["Vas", "Hét", "Kedd", "Sze", "Csüt", "Pén", "Szo"];
          $scope.changeTo= 'English';
        } else {
          $scope.uiConfig.calendar.dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
          $scope.uiConfig.calendar.dayNamesShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
          $scope.changeTo = 'Hungarian';
        }
      };

        $scope.accountEvents = {
         onItemSelect: function(item) {
          UserService.getAccountServices(item.id).then(function (response) {
            $scope.serdata = response.data.service_id ;
          });
          $scope.type="filter";
          $scope.eventSources=[fetchEvents];
          $('#mycalendar').fullCalendar('refetchEvents') ;
          },
          onItemDeselect: function(item) {
          $scope.type="filter";
          $scope.eventSources=[fetchEvents];
          $('#mycalendar').fullCalendar('refetchEvents') ;
          },
          onDeselectAll: function() {
          $scope.accountmodel.length=0;
          $scope.type="filter";
          $scope.eventSources=[fetchEvents];
          $('#mycalendar').fullCalendar('refetchEvents') ;
          },
        };
        $scope.serEvents = {
         onItemSelect: function(item) {
          $scope.type="filter";
          $scope.eventSources=[fetchEvents];
          $('#mycalendar').fullCalendar('refetchEvents') ;
          },
          onItemDeselect: function(item) {
          $scope.type="filter";
          $scope.eventSources=[fetchEvents];
          $('#mycalendar').fullCalendar('refetchEvents') ;
          },
          onDeselectAll: function() {
          $scope.accountmodel.length=0;
          $scope.type="filter";
          $scope.eventSources=[fetchEvents];
          $('#mycalendar').fullCalendar('refetchEvents') ;
          },
        };
        $scope.resourceEvents = {
         onItemSelect: function(item) {
          $scope.type="filter";
          $scope.eventSources=[fetchEvents];
          $('#mycalendar').fullCalendar('refetchEvents') ;
          },
          onItemDeselect: function(item) {
          $scope.type="filter";
          $scope.eventSources=[fetchEvents];
          $('#mycalendar').fullCalendar('refetchEvents') ;
          },
          onDeselectAll: function() {
          $scope.resourcemodel.length=0;  
          $scope.type="filter";
          $scope.eventSources=[fetchEvents];
          $('#mycalendar').fullCalendar('refetchEvents') ;
          },
        };
        $scope.skillEvents = {
         onItemSelect: function(item) {
          $scope.type="filter";
          $scope.eventSources=[fetchEvents];
          $('#mycalendar').fullCalendar('refetchEvents') ;
          },
          onItemDeselect: function(item) {
          $scope.type="filter";
          $scope.eventSources=[fetchEvents];
          $('#mycalendar').fullCalendar('refetchEvents') ;
          },
          onDeselectAll: function() {
          $scope.skillmodel.length=0;  
          $scope.type="filter";
          $scope.eventSources=[fetchEvents];
          $('#mycalendar').fullCalendar('refetchEvents') ;
          },
        };


      
          var vm = this;
          
          
          UserService.getAccounts().then(function (response) {
            $scope.accountdata = response.data;
          });
          UserService.getResources().then(function (response) {
            $scope.resourcedata = response.data;
          });
          UserService.getSkills().then(function (response) {
            $scope.skilldata = response.data;
          });
          $scope.accountsettings = {
            // smartButtonMaxItems: 1,
            scrollableHeight: '200px',
            scrollable: true,
            enableSearch: true,
            displayProp:'account_name',
            idProp:'id',
            externalIdProp:'',
            // selectionLimit: 1,
            // showUncheckAll :false,
            // closeOnSelect:true,
            buttonClasses:"smbutton btn btn-default"

          };
           $scope.sersettings = {
            // smartButtonMaxItems: 1,
            scrollableHeight: '200px',
            scrollable: true,
            enableSearch: true,
            displayProp:'service_code',
            idProp:'id',
            externalIdProp:'',
            // selectionLimit: 1,
            // showUncheckAll :false,
            // closeOnSelect:true,
            buttonClasses:"smbutton btn btn-default"

          };
          
          $scope.resourcemodel = [];
          $scope.resourcesettings = {
      scrollableHeight: '200px',
        scrollable: true,
      enableSearch: true,
      displayProp:'employee_name',
      idProp:'id',
      externalIdProp:'',
      closeOnBlur:true
        
    };
    $scope.skillmodel = [];
    $scope.skillsettings = {
      scrollableHeight: '200px',
        scrollable: true,
      enableSearch: true,
      displayProp:'skill_name',
      idProp:'id',
      externalIdProp:'',
      closeOnBlur:true
        
    };
    

          vm.user = null;
         // vm.allUsers = [];
          //vm.deleteUser = deleteUser;

          initController();

          function initController() {
            loadCurrentUser();
              //loadAllUsers();
            }

            function loadCurrentUser() {
              vm.username=$rootScope.globals.currentUser.username;
              /*UserService.GetByUsername($rootScope.globals.currentUser.username)
                  .then(function (user) {
                      vm.user = user;
                    });*/
  }

          /*function loadAllUsers() {
              UserService.GetAll()
                  .then(function (users) {
                      vm.allUsers = users;
                  });
  }*/

          /*function deleteUser(id) {
              UserService.Delete(id)
              .then(function () {
                  loadAllUsers();
              });
  }*/
  }

  })();