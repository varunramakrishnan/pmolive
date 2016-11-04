(function () {
    'use strict';

    angular
        .module('app')
        .controller('ServiceProjectController', ServiceProjectController)
        .controller('ServiceProjectEditController', ServiceProjectEditController)
        .controller('ServiceProjectDeleteController', ServiceProjectDeleteController);
  ServiceProjectController.$inject = ['$rootScope','$timeout','$cookieStore','$scope','$state','$log','$http','UserService', '$location', 'FlashService','RowEditor'];
  function ServiceProjectController($rootScope,$timeout,$cookieStore,$scope,$state,$log,$http,UserService, $location,FlashService,RowEditor) {

        var vm = this;
        $rootScope.shownav=true;
        $scope.showservice= 0;
        $scope.showmetadata= 0;
        $rootScope.rootAccess =  $cookieStore.get("rootAccess");
        $rootScope.pmAccess =  $cookieStore.get("pmAccess");
        var jsonstring="";
        vm.saveserviceproject = saveserviceproject;
        var rowIndexTemp = 0;
        $scope.accountmodel = [];
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
          externalIdProp:'',
          selectionLimit: 1,
          showUncheckAll :false,
          closeOnSelect:true
            
        };
        $scope.open2 = function() {
    $scope.popup2.opened = true;
  };
  $scope.popup2={};
      $scope.open1 = function() {
    $scope.popup1.opened = true;
  };
  $scope.popup1={};
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
        $scope.accountEvents = {
                             onItemSelect: function(item) {
                                  FlashService.clearMessage();
                                  $scope.sermodel= [];
                                  $scope.showservice= 1;
                                  UserService.getAccountServices(item.id).then(function (response){
                                    $scope.serdata = response.data.service_id ;
                                  });
                                  UserService.getAllAccountProjects(item.id,$scope.sermodel.id).then(function (response){
                                    console.log(response.data.length);
                                    if(response.data.length){
                                      $scope.accountprojects = response.data;                                      
                                    }else{
                                      $scope.accountprojects=[];
                                    }
                                    console.log($scope.accountprojects);
                                  });
                                  },
                                };
        $scope.serEvents = {
                             onItemSelect: function(item) {
                              $scope.accountprojects=[];
                              $scope.showmetadata= 1;
                                  UserService.getAllAccountProjects($scope.accountmodel.id,item.id).then(function (response){
                                    if(response.data.length){
                                      $scope.accountprojects = response.data;                                      
                                    }else{
                                      $scope.accountprojects=[];
                                    }
                                  });
                                  },
                                };
        
    

     function saveserviceproject() {
            vm.dataLoading = true;
            vm.serpro.account_id=$scope.accountmodel.id;
            vm.serpro.service_id=$scope.sermodel.id;
            vm.serpro.modifiedBy=$cookieStore.get('globals').currentUser.userId;
            vm.serpro.createdBy=$cookieStore.get('globals').currentUser.userId;
            console.log($cookieStore.get('globals').currentUser);
            UserService.saveServiceProject(vm.serpro)
                .then(function (response) {
                    if (response.data.id) {
                        FlashService.Success('Save successful', true);
                        vm.dataLoading = false;
                        UserService.getAllServiceProjects()
                          .then(function (response) {
                            $state.go("serviceproject", {}, {reload: true});
                              vm.gridOptions.data = response.data;
                           });
                    } else {
                      // if(response.data.error.service_name){
                      //   FlashService.Error('Project Name ' +response.data.error.service_name[0]);

                      // }
                      // if(response.data.error.service_code){
                        FlashService.Error('Something happened . Please try again');
                        
                      // }
                        vm.dataLoading = false;
                    }
                });
        }

   


vm.gridOptions = {
   rowHeight: 30,

    columnDefs: [
    { field: 'id', name: 'E/D', cellTemplate:'<div class="ui-grid-cell-contents"><a href="#/project/edit/{{row.entity.id}}"><button type="button" class="btn btn-xs btn-primary" ><i class="fa fa-edit"></i></button></a>&nbsp<a href="#/project/delete/{{row.entity.id}}"  ><button type="button" class="btn btn-xs danger-class"  ><i  class="fa fa-trash"></i></button></a></div>', width: 70 },
    { name: 'project_name',width: 180 },
    { name: 'project_code' ,width: 180},
    // { name: 'start_date' ,minWidth: 260},
    // { name: 'end_date' ,minWidth: 260},

    ],
    enableCellEdit: false,
    enableHorizontalScrollbar: 0, 
    enableVerticalScrollbar:2,

  };
  $scope.getTableHeight = function() {
       var rowHeight = 30; // your row height
       var headerHeight = 50; // your header height
       return {
          height: (vm.gridOptions.data.length * rowHeight + headerHeight) + "px"
       };
    };
  UserService.getAllServiceProjects()
     .then(function (response) {
      vm.gridOptions.data = response.data;
     });
    }



ServiceProjectEditController.$inject = ['$scope','$rootScope','$log','$cookieStore','$state','$http','UserService', '$location', 'FlashService','$timeout','$routeParams'];
function ServiceProjectEditController($scope,$rootScope,$log,$cookieStore,$state,$http,UserService, $location,FlashService,$timeout,$routeParams) {
  var vm=this;
  $scope.showservice= 1;
  $scope.showmetadata= 1;
   vm.saveserviceproject = saveserviceproject;
  var splits=$location.url().toString().split("/");
  UserService.getProject(splits[splits.length - 1])
                  .then(function (response) {
                      if (response.data) {
                        vm.serpro = response.data;
                        $scope.accountmodel.id=vm.serpro.account_id;
                        UserService.getAccountServices(vm.serpro.account_id).then(function (response){
                                    $scope.serdata = response.data.service_id ;
                                  });
                        $scope.sermodel.id=vm.serpro.service_id;
                       // vm.account.start_date=$scope.minEndDate;
             // //vm.account.end_date=$scope.maxEndDate;
             // vm.account.anticipated_value = vm.account.anticipated_value.concat(" ").concat(vm.account.anticipated_value_currency);
                      } 
                  });
                  $scope.accountEvents = {
                             onItemSelect: function(item) {
                              
                                  FlashService.clearMessage();
                                  $scope.sermodel= [];
                                  UserService.getAccountServices(item.id).then(function (response){
                                    $scope.serdata = response.data.service_id ;
                                  });
                                  UserService.getAllAccountProjects(item.id,$scope.sermodel.id).then(function (response){
                                    console.log(response.data.length);
                                    if(response.data.length){
                                      $scope.accountprojects = response.data;                                      
                                    }else{
                                      $scope.accountprojects=[];
                                    }
                                    console.log($scope.accountprojects);
                                  });
                                  },
                                };
        $scope.serEvents = {
                             onItemSelect: function(item) {
                              $scope.accountprojects=[];
                                  UserService.getAllAccountProjects($scope.accountmodel.id,item.id).then(function (response){
                                    if(response.data.length){
                                      $scope.accountprojects = response.data;                                      
                                    }else{
                                      $scope.accountprojects=[];
                                    }
                                  });
                                  },
                                };

                  function saveserviceproject() {
                    vm.gridOptions = {};
            vm.dataLoading = true;
            vm.serpro.account_id=$scope.accountmodel.id;
            vm.serpro.service_id=$scope.sermodel.id;
            vm.serpro.id = splits[splits.length - 1];
            vm.serpro.modifiedBy=$rootScope.globals.currentUser.userId;
            UserService.editServiceProject(vm.serpro)
                .then(function (response) {
                    if (response.data.id) {
                        FlashService.Success('Save successful', true);
                        vm.dataLoading = false;
                        UserService.getAllServiceProjects()
                          .then(function (response) {
                            $state.go("serviceproject", {}, {reload: true});
                              vm.gridOptions.data = response.data;
                           });
                    } else {
                      // if(response.data.error.service_name){
                      //   FlashService.Error('Project Name ' +response.data.error.service_name[0]);

                      // }
                      // if(response.data.error.service_code){
                         FlashService.Error('Something happened . Please try again');
                        
                      // }
                        vm.dataLoading = false;
                    }
                });
        }
  
  
      

  }

  ServiceProjectDeleteController.$inject = ['$rootScope','$scope','$state','$log','$http','UserService', '$location', 'FlashService', 'RowEditor', '$timeout','$routeParams'];
function ServiceProjectDeleteController($rootScope,$scope,$state,$log,$http,UserService, $location,FlashService,RowEditor,$timeout,$routeParams) {
  var vm=this;
   vm.deleteproject = deleteproject;
   
  var splits=$location.url().toString().split("/");
                  
  function deleteproject() {
              vm.dataLoading = true;
              UserService.deleteProject(splits[splits.length - 1])
                  .then(function (response) {
                      if (response.status==204) {
                          FlashService.Success('Delete successful', true);
                          vm.dataLoading = false;
                          $state.go("serviceproject", {}, {reload: true});
                      } else {
                          FlashService.Error(response.message);
                          vm.dataLoading = false;
                      }
                  });
          }
  }


     
    
})();

