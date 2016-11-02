        (function () {
          'use strict';

          angular
          .module('app')
          .controller('ProjectController', ProjectController)
          .directive('overlay',ProjectDirective);
          ProjectController.$inject = ['$state','$rootScope','$cookieStore','$anchorScroll','$scope','$log','$http','UserService', '$location', 'FlashService','RowEditor','$filter','$q','uiCalendarConfig','$compile'];
          function ProjectController($state,$rootScope,$cookieStore,$anchorScroll,$scope,$log,$http,UserService, $location,FlashService,RowEditor,$filter,$q,uiCalendarConfig,$compile) {

            var vm = this;
            var splits=$location.url().toString().split("/");
            var strings=splits[splits.length-1];
            var newEl = angular.element( document.querySelector( ".hideoncalendar" ) );
            $scope.showprodate=0;
            if(strings=="calendar"){
              newEl.addClass("hidden"); 
            }else{
              newEl.removeClass("hidden"); 
            }
            var rTEvents = [];
            $rootScope.shownav=true;
            $rootScope.rootAccess =  $cookieStore.get("rootAccess");
            $rootScope.pmAccess =  $cookieStore.get("pmAccess");
            $scope.accountcustomTexts = {buttonDefaultText: 'Select Account'};
            $scope.servicecustomTexts = {buttonDefaultText: 'Select Service'};
            $scope.projectcustomTexts = {buttonDefaultText: 'Select Project'};
            $scope.peoplecustomTexts = {buttonDefaultText: 'People'};
            $scope.type = "range";
            $scope.class=="red";
            $scope.end = new Date();
            $scope.example13model = [];
            $scope.hidesave=1;
            $scope.resource ;
            $scope.singleperSelect="100";
            $scope.example13settings = {
              scrollableHeight: '200px',
              scrollable: true,
              enableSearch: true,
              displayProp:'employee_name',
              idProp:'id',
              externalIdProp:'',
              closeOnBlur:true,
              groupByTextProvider: function(groupValue) { if (groupValue === 'F') { return 'Suggested'; } else { return 'Remaining'; } } 
            };
            $scope.events = [] ;
            $scope.uiConfig = {
              calendar:{
                height: 450,
                width: 650,
                editable: false,
                header:{
                  left: 'title',
                  center: '',
                  right: 'today prev,next'
                },
                eventClick: $scope.alertOnEventClick,
                eventDrop: $scope.alertOnDrop,
                eventResize: $scope.alertOnResize,
                eventRender: $scope.eventRender,
                eventLimit: true, 
                views: {
                  agenda: {
                            eventLimit: 2 // adjust to 6 only for agendaWeek/agendaDay
                          }
                        }
                      }
                    };

            $scope.person = {};
            $scope.reshowButtons =function(){
             var newEl = angular.element( document.querySelector( ".hideoncalendar" ) );
             newEl.removeClass("hidden"); 
            }
             $scope.disabled = function(date) {
              var flag = 0;
              var d = new Date(date);
              var day=d.getDay();
                if(day==0 || day==6){
                  return true;
                }else{

                  if($scope.newMax || $scope.newMin){
                    if((date.getTime() > $scope.newMax) || (date.getTime() < $scope.newMin) )
                     return true;
                   return false;  
                 }else{
                  return false;  
                }
              }
            }
             $scope.dselect = function(date) {
               if((date.getTime() > Math.max.apply(Math, $scope.accountrangeDates)) || (date.getTime() < Math.min.apply(Math, $scope.accountrangeDates)) )
                return true;
              return false;
            }
            $scope.resmodel = [];
            $scope.ressettings = {
              smartButtonMaxItems: 1,
              scrollableHeight: '200px',
              scrollable: true,
              enableSearch: true,
              displayProp:'employee_name',
              idProp:'id',
              externalIdProp:'',
              showUncheckAll :false,
              closeOnBlur:true,
              closeOnSelect:true
            };
            $scope.account=[];
            $scope.rowClass = function(item){
              if(!item.saved){
                return item;            
              }else{
                return false;
              }
            };
            $scope.eventRender = function( event, element, view ) {
            element.attr({
              'tooltip': event.title,
              'tooltip-append-to-body': true,
              'eventColor': '#378006'});
            $compile(element)($scope);
            };
            $scope.accountEvents = {
             onItemSelect: function(item) {

              FlashService.clearMessage();
              $scope.per = "P";
              $scope.sermodel= [];
              $scope.showsave = 1;
              $scope.items.length=0;
              $scope.resmodel.length=0;
              $scope.resource=0;
              $scope.IsVisible=$scope.calmodel=$scope.showprodate=$scope.calrangemodel=item.id;
                UserService.getAccountServices(item.id).then(function (response){
                  $scope.serdata = response.data.service_id ;
                });
                UserService.getallFilteredResources(item.id).then(function (response){
                  $scope.example13data = response.data ;
                  UserService.getModeledResource(item.id).then(function (response){
                    $scope.example13model = response.data;
                    if($scope.example13model){
                      $scope.addresmodel=$scope.showreshere=1;
                      $scope.calrangemodel=0;
                    }
                  });
                  UserService.getMappedResource(item.id).then(function (response){
                  $scope.items = response.data ;
                  if($scope.items.length){
                    $scope.hidesave=0;
                  }else{
                    $scope.hidesave=1;
                  }
                  $scope.existingItems = angular.copy(response.data);
                  });
                });
                UserService.getAccount(item.id).then(function (response){
                  $scope.account = response.data ;
                  $scope.newMax = $scope.account.end_date;
                  $scope.newMin = $scope.account.start_date;

                  $rootScope.$broadcast('refreshDatepickers');
                  $scope.IsVisible = 0; 
                });

                $scope.eventSources = [fetchEvents];
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
            };
            $scope.yourEvents = {
             onItemSelect: function(item) {
              $scope.selectedDates.length = 0;
              $scope.resource=item.id;
              $scope.singleres=item.employee_name;
              var resdata={};
              resdata.id=item.id;
              resdata.account=$scope.accountmodel.id;
              var res ={"resources":resdata};
                UserService.getResourceAccountDates(res).then(function (response){
                  $scope.disdate=response.data.dis;
                  angular.forEach(response.data.ena, function(value) {
                    $scope.selectedDates.push(parseInt(value.start)-19800000);
                  }); 
                  $rootScope.$broadcast('refreshDatepickers');
                });
              },
            };
            $scope.serEvents = {
             onItemSelect: function(item) {
              $scope.per = item.mapping_format; 
              $scope.promodel.id=0;
              var data = {"account_id":$scope.accountmodel.id,"service_id":item.id}
              UserService.getServiceDates(data).then(function (response){
                var mindate = new Date(response.data[0].start_date).getTime();
                var maxdate = new Date(response.data[0].end_date).getTime();
                $scope.newMax = maxdate ;
                $scope.newMin = mindate ;
                $scope.showaccountdates = 1;
              });
              UserService.getFilteredProjects(data).then(function (response){
                $scope.prodata = response.data ;
                $scope.showprodate=1;
                if(!$scope.prodata.length){
                 $scope.promodel.id=0;
                 // $scope.promodel.project_code=$scope.sermodel.service_code;
               }
             });
            },
          };

          $scope.resourceEvents = {
           onItemSelect: function(item) {
              $scope.addresmodel=$scope.showreshere=1;
              $scope.calrangemodel=0;
            },
            onItemDeselect: function(item) {
              var rs=$filter('filter')($scope.resmodel, {id: item.id});
              if(rs[0]){
                for (var i = $scope.resmodel.length - 1; i >= 0; i--) {
                  if ($scope.resmodel[i].id==item.id) {
                    $scope.resmodel.splice(i, 1);
                  }
                }                                                
              }
            },
            onDeselectAll: function() {
              $scope.resmodel.length=0;
            },
          };
          $scope.accountmodel = [];
          $scope.promodel = [];
          $scope.sermodel = [];
          UserService.getAccounts().then(function (response) {
            $scope.accountdata = response.data;
          });
          $scope.accountsettings = {
            smartButtonMaxItems: 1,
            scrollableHeight: '200px',
            scrollable: true,
            enableSearch: true,
            displayProp:'account_name',
            idProp:'id',
            externalIdProp:'id',
            selectionLimit: 1,
            showUncheckAll :false,
            closeOnSelect:true

          };
          $scope.prosettings = {
            smartButtonMaxItems: 1,
            scrollableHeight: '200px',
            scrollable: true,
            enableSearch: true,
            displayProp:'project_code',
            idProp:'id',
            externalIdProp:'',
            selectionLimit: 1,
            showUncheckAll :false,
            closeOnSelect:true

          };
          $scope.sersettings = {
            smartButtonMaxItems: 1,
            scrollableHeight: '200px',
            scrollable: true,
            enableSearch: true,
            displayProp:'service_code',
            idProp:'id',
            externalIdProp:'',
            selectionLimit: 1,
            showUncheckAll :false,
            closeOnSelect:true

          };
          $scope.eventDetails = eventDetails;
          function eventDetails(event){
           $scope.selected = event;
           $scope.query = event;
          }
         $scope.activeDate;
         $scope.selectedDates = [];
         $scope.accountrangeDates = [];
         $scope.accountrange;
         $scope.user = [];
         var ary=[]
         var mydata = 
         {resource_id: '', name: '', Dates : '' }
         ;
         $scope.mynewdata = [
         {resource_id: '', name: '', Dates : '' }]
         ;
         $scope.items = [];
         $scope.removeFromSelected = function (dt) {
          $scope.selectedDates.splice($scope.selectedDates.indexOf(dt), 1);
         }
          $scope.ShowHide = function () {
          $scope.calrangemodel=$scope.IsVisible = $scope.IsVisible ? false : true;
          }
          $scope.respevents = function (id,name) { 
            var text= 'button'+'#'+name+id ;
            var myEl = angular.element( document.querySelector( text ) ); 
            if(myEl.hasClass("btn-default")){
              myEl.removeClass('btn-default');
              myEl.addClass('btn-primary');
            }else{
              myEl.removeClass('btn-primary');
              myEl.addClass('btn-default');
            }
            FlashService.clearMessage();
            var news = { id: '', employee_name: ''};
            news.id=id;
            news.employee_name=name;                        

            var rs=$filter('filter')($scope.resmodel, {id: id});
            if(rs[0]){
              for (var i = $scope.resmodel.length - 1; i >= 0; i--) {
                if ($scope.resmodel[i].id==id) {
                  $scope.resmodel.splice(i, 1);
                }
              }                                                
            }else{
              $scope.resmodel.push(news);  
            }
            $scope.activeDate=null;
            $scope.selectedDates.length = 0;
            $scope.resource=id;
                                                 // $scope.resmodel.id=id;
             $scope.singleres=name;
             var resdata={};
             resdata.id=id;
             resdata.account=$scope.accountmodel.id;
             var res ={"resources":resdata};
              // UserService.getResourceAccountDates(res).then(function (response){
                $rootScope.$broadcast('refreshDatepickers');
              // });

            }
            $scope.reload = function () {
              $scope.selectRange = 1;
              $scope.minEndDate=Math.min.apply(Math, $scope.accountrangeDates);
              $scope.maxEndDate=Math.max.apply(Math, $scope.accountrangeDates);
            }
            $scope.addAccountDates = function () {
              $scope.newMax = Math.max.apply(Math, $scope.accountrangeDates);
              $scope.newMin = Math.min.apply(Math, $scope.accountrangeDates);
              $scope.showaccountdates = 1;
              $rootScope.$broadcast('refreshDatepickers');
              $scope.IsVisible = 0;
            }
            $scope.changeAccountDates = function () {
              $scope.calrangemodel = 1;
              $rootScope.$broadcast('refreshDatepickers');
            }
            $scope.remresdate = function (resource_id,service_id,project_id,percentage_loaded) {
              for (var key in $scope.items) {
                if(($scope.items[key].resource_id == resource_id) && $scope.items[key].service_id == service_id && $scope.items[key].project_id == project_id && $scope.items[key].percentage_loaded == percentage_loaded){
                 $scope.items.splice(key, 1);
               }
             }
             for (var key in $scope.existingItems) {
              if(($scope.existingItems[key].resource_id == resource_id) && $scope.existingItems[key].service_id == service_id && $scope.existingItems[key].project_id == project_id && $scope.existingItems[key].percentage_loaded == percentage_loaded){
                  $scope.existingItems[key].conflict = 1;
                }
              }
            }
            var ser = 0;
            $scope.showservice = function(value){
              if(ser == value){
                return 0;
              }else{
                ser=value;
                return 1;
              }
            }
            var resids=[];
            $scope.add = function(date) {
              var text= 'div.single ul li button' ;
              var myEl = angular.element( document.querySelectorAll( text ) ); 
              if(myEl.hasClass("btn-primary")){
                myEl.removeClass('btn-primary');
                myEl.addClass('btn-default');
              }
              $scope.tempitems=angular.copy($scope.items);
              var itemobjArray={};
              angular.forEach($scope.items, function(k) {
                angular.forEach(k.Dates, function(val) {
                      if((k.service_id == $scope.sermodel.id) && (k.project_id == $scope.promodel.id)){
                        if(itemobjArray[val] === undefined){
                          itemobjArray[val] = {};
                        }
                        if(itemobjArray[val][k.resource_id] === undefined){
                         itemobjArray[val][k.resource_id]=0;
                       }
                       if(itemobjArray[val][k.resource_id]!=0){
                        itemobjArray[val][k.resource_id] = Number(itemobjArray[val][k.resource_id]) + (Number(k.percentage_loaded)/12.5); 
                        }else{
                         itemobjArray[val][k.resource_id] = Number(k.percentage_loaded)/12.5; 
                       }
                      }
                });
              });
              var newdate=[];
              angular.forEach($scope.resmodel, function(value) {
                if((resids.indexOf(value.id) == -1)){
                  resids.push(value.id);
                }
              });  
              angular.forEach(date, function(value) {
                var d = new Date(value);
                var day=d.getDay();
                if(!(day==0 || day==6)){
                 newdate.push(value+19800000);
               }
              });
              var freepass=0;
              if($scope.per=="H"){
                var flag=1;
              }
              else{
                freepass=1;
                var flag=0;
              }
              var array=[];
              var objarr={};
              var nobjarr={};
              var hrs=$scope.singleserSelect;
              if((Number(hrs)<=(newdate.length * $scope.resmodel.length * 8)) || freepass){
                if(freepass){
                  var h=Number($scope.singleperSelect)/12.5;
                }else{
                  var h=Number(hrs)/(newdate.length * $scope.resmodel.length);
                  var mod=hrs % (newdate.length * $scope.resmodel.length);
                  if((h-Math.floor(h))==0){
                    flag=0;
                  }
                }
                angular.forEach(newdate, function(value) {
                  var obj={};
                  angular.forEach($scope.resmodel, function(res) {
                    obj[res.id]=Math.floor(h);
                  });                    
                  objarr[value]=obj;
                });
                if(flag){
                  if(mod !=0){
                    var keepGoing = true;
                    angular.forEach(objarr, function(value,keys) {
                      if(keepGoing){
                        angular.forEach(value, function(val,key) {
                          if(keepGoing){
                            objarr[keys][key]=val + 1;
                            mod--;
                            if(mod==0){
                              keepGoing=0;
                            }
                          }
                        });
                      }                    
                    });
                  }
                }
                angular.forEach($scope.resmodel, function(resour) {
                  nobjarr[resour.id]= {};
                  for(var l=1; l<=8; l++) {
                   nobjarr[resour.id] [l]=[];
                 }
                });

                angular.forEach(itemobjArray, function(values,keyss) {
                  angular.forEach(values, function(vasl,k) {
                    if(objarr[keyss] === undefined){
                      objarr[keyss] = {};
                    }
                    if(objarr[keyss][k] === undefined){
                     objarr[keyss][k]=0;
                   }
                   if(objarr[keyss][k]!=0){
                    objarr[keyss][k] = objarr[keyss][k] + Number(itemobjArray[keyss][k]);
                  }else{
                    objarr[keyss][k] = Number(itemobjArray[keyss][k]);
                  }

                });
                }); 
                angular.forEach(objarr, function(values,keyss) {
                  angular.forEach(values, function(vasl,k) {
                    if(nobjarr[k] !== undefined){
                      if(nobjarr[k][vasl] === undefined){
                       nobjarr[k][vasl]=[];
                     }
                     nobjarr[k] [vasl].push(Number(keyss));
                   }
                 });
                }); 
                var checkflag=0;
                var perval=0;
                angular.forEach(objarr, function(value,keys) {
                  angular.forEach(value, function(val,k) {
                    perval=0;
                    for (var key in $scope.items) {
                      if(($scope.items[key].resource_id == k ) && (($scope.items[key].service_id != $scope.sermodel.id) || ($scope.items[key].project_id != $scope.promodel.id))){
                        var found=0;
                        angular.forEach($scope.items[key].Dates, function(v) {
                          if(keys == v){
                            found=1;
                          }
                        });
                        if(found){
                          perval=perval+ Number($scope.items[key].percentage_loaded);
                                 //chcks whether resource is loaded more than 100%
                               }
                             }
                           }
                           perval=perval + val*12.5 ;
                           if(perval>100){
                            checkflag = 1;
                          }
                        });
                });
                if(checkflag){
                  FlashService.Error("One of the resource was loaded more than 100 %");
                }else{
                      angular.forEach(nobjarr, function(value,keys) {
                        var newfiltered = $filter('filter')($scope.items, { resource_id: Number(keys), service_id: $scope.sermodel.id, project_id: $scope.promodel.id});
                        if(newfiltered.length>=1){
                          for (var key in $scope.items) {
                            if(($scope.items[key].resource_id == keys) && ($scope.items[key].service_id == $scope.sermodel.id) && ($scope.items[key].project_id == $scope.promodel.id)){// && ($scope.items[key].percentage_loaded == perload) ){
                              delete($scope.items[key]);
                              //$scope.items.splice(key,1);
                            }
                          }
                                var newArray = [];
                                for (var i = 0; i < $scope.items.length; i++) {
                                  if ($scope.items[i] !== undefined && $scope.items[i] !== null && $scope.items[i] !== "") {
                                    newArray.push($scope.items[i]);
                                  }
                                }
                                $scope.items.length=0;
                                $scope.items=angular.copy(newArray);
                        }
                        

                        angular.forEach(value, function(val,k) {
                          if(val.length){
                            var servdata ={};
                            var perload = k*12.5;
                            var filtered = $filter('filter')($scope.items, { resource_id: keys, service_id: $scope.sermodel.id, project_id: $scope.promodel.id, percentage_loaded: perload});
                            servdata.resource_id=Number(keys);
                            servdata.account_id=$scope.accountmodel.id;
                            angular.forEach($scope.resmodel, function(value) {
                             if(value.id == Number(keys)){
                               servdata.name=value.employee_name;
                             }
                            });
                            servdata.service_id=$scope.sermodel.id;
                            servdata.service_code=$scope.sermodel.service_code;
                            servdata.project_id=$scope.promodel.id;
                            servdata.project_code=$scope.promodel.project_code;
                            servdata.flagged= 1;
                            servdata.Dates  = val;
                            servdata.minDate= Math.min.apply(Math, val);
                            servdata.maxDate= Math.max.apply(Math, val);
                            servdata.noOfDays= val.length;
                            servdata.percentage_loaded=perload;
                            var newflag;
                            if(filtered.length==0){
                              $scope.items.push(angular.copy(servdata));
                            }else{
                              newflag=1;
                              for (var key in $scope.items) {
                                  if(($scope.items[key].resource_id == Number(keys)) && ($scope.items[key].service_id == $scope.sermodel.id) && ($scope.items[key].project_id == $scope.promodel.id)){// && ($scope.items[key].percentage_loaded == perload) ){
                                    newflag=0;
                                    $scope.items[key].account_id=angular.copy($scope.accountmodel.id);
                                    $scope.items[key].name=angular.copy(servdata.name);
                                    $scope.items[key].Dates=angular.copy(val);
                                    $scope.items[key].service_id=angular.copy($scope.sermodel.id);
                                    $scope.items[key].service_code=angular.copy($scope.sermodel.service_code);
                                    $scope.items[key].project_id=angular.copy($scope.promodel.id);
                                    $scope.items[key].project_code=angular.copy($scope.promodel.project_code);
                                    $scope.items[key].percentage_loaded=angular.copy(servdata.percentage_loaded);
                                    $scope.items[key].maxDate= Math.max.apply(Math, val);
                                    $scope.items[key].minDate=Math.min.apply(Math, val);
                                    $scope.items[key].noOfDays=val.length;
                                    $scope.items[key].saved=0;
                                  }
                                }
                                
                                if(newflag){
                                 $scope.items.push(angular.copy(servdata));
                               }

                             }
                             for (var keyss in $scope.existingItems) {
                                if(($scope.existingItems[keyss].resource_id == Number(keys)) && ($scope.existingItems[keyss].service_id == $scope.sermodel.id) && ($scope.existingItems[keyss].project_id == $scope.promodel.id) ){
                                  $scope.existingItems[keyss].conflict=1;
                                }
                              }
                          }
                        });
                      });
                      var finalres={};
                      var servces={};
                      angular.forEach(resids, function(value) {
                       var newtempres={};
                       var newser=[];
                       for (var key in $scope.items) {
                          if(($scope.items[key].resource_id == value)){
                            newser.push($scope.items[key].service_id);
                            angular.forEach($scope.items[key].Dates, function(val) {
                              if(newtempres[val]){
                                newtempres[val] = newtempres[val] + Number($scope.items[key].percentage_loaded);
                              }else{
                                newtempres[val] = Number($scope.items[key].percentage_loaded);  
                              }
                            });
                          }
                        }
                        var nkey= value;
                        finalres[nkey] = newtempres;
                        servces[nkey] = newser;
                      });
                      var data = {"resources":finalres,"account_id":$scope.accountmodel.id,"service_ids":servces};
                      $scope.resmodel.length = 0;
                      var res = {};
                      var newstr='';

                      UserService.validateNewResDetails(data).then(function (response){
                        var errres=[];
                        var oldData=[];
                        angular.forEach(response.data, function(value) {
                          if(value.success==0){
                            for (var key in $scope.items) {
                             if(($scope.items[key].resource_id == value.resource_id) && ($scope.items[key].service_id == $scope.sermodel.id) && ($scope.items[key].project_id == $scope.promodel.id) ){
                              if($scope.tempitems[key]){
                                if($scope.tempitems[key].saved == 1){
                                  var newflag=1;
                                }else{
                                  var newflag=0;
                                }

                              }
                              if($scope.items[key].saved != 1){
                               $scope.items[key].delete=1;
                             }
                           }
                         }

                         for (var key in $scope.tempitems) {
                           if(($scope.tempitems[key].resource_id == value.resource_id) && ($scope.tempitems[key].service_id == $scope.sermodel.id) && ($scope.tempitems[key].project_id == $scope.promodel.id) ){
                              $scope.newitem=angular.copy($scope.tempitems[key]);
                              $scope.newitem.saved=0;
                              oldData.push($scope.newitem);
                            }
                          }
                          // for (var key in $scope.existingItems) {
                          //    if(($scope.existingItems[key].resource_id == value.resource_id) && ($scope.existingItems[key].service_id == $scope.sermodel.id) && ($scope.existingItems[key].project_id == $scope.promodel.id) ){
                          //     $scope.existingItems[key].conflict=0;
                          //   }
                          // }



                            var sumstr="";
                            sumstr=(value.name + " is occupied on the following dates - ");
                            
                            var datestring='';
                            value.dates.sort();
                            angular.forEach(value.dates,function(nvalue) {
                              var d = new Date(Number(nvalue));
                              datestring=datestring+((d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear())+ ",");
                            });
                            if(errres.indexOf(value.resource_id) == -1){
                              newstr=newstr+(" "+sumstr+datestring)+"<br>";
                              errres.push(value.resource_id);
                            }
                          }
                        });
                        if(newstr){
                          FlashService.Error(newstr, true);  
                        }

                        var mydata={};
                        var newFinArray = [];
                        for (var i = 0; i < $scope.items.length; i++) {
                          if ($scope.items[i].delete != 1) {
                            newFinArray.push($scope.items[i]);
                          }
                        }
                        for (var i = 0; i < oldData.length; i++) {
                          newFinArray.push(oldData[i]);
                        }
                        $scope.items.length=0;
                        $scope.items=angular.copy(newFinArray);
                      });
                }
              }else{
                FlashService.Error("The number of hours given to add is more than the available number of hours for the number of days selected");
              }
              $scope.resmodel.length=0;

            };

            $scope.saveproject = function() {
              var account = {};
              var accountDetails = {};
              accountDetails.id = $scope.accountmodel.id;
              accountDetails.resources = $scope.items;
              accountDetails.minEndDate = $scope.newMin;
              accountDetails.maxEndDate = $scope.newMax;
                          //accountDetails.maxEndDate =Math.max.apply(Math, $scope.accountrangeDates)+19800000;
              account = {"account" : accountDetails};
              if($scope.items.length){
                 UserService.saveAccountDetails(account).then(function (response){
                    FlashService.Success("People have been mapped to the project", true); 
                    $state.go("project", {}, {reload: true});
                  });
               }else{
                   UserService.deleteAccountMapping(account).then(function (response){
                      FlashService.Success("All the Mappings has been removed", true); 
                      $state.go("project", {}, {reload: true});
                    });
               }
               $location.hash('topwindow');
                $anchorScroll();
                    }

        }


        function ProjectDirective() {
          return {
            replace: true,
            templateUrl: "overlay.html"
          };
        }


      })();



