(function () {
    'use strict';

    angular
        .module('app')
        .controller('ServicesController', ServicesController)
        .controller('ServicesEditController', ServicesEditController)
        .controller('ServicesDeleteController', ServicesDeleteController);
	ServicesController.$inject = ['$rootScope','$timeout','$cookieStore','$scope','$state','$log','$http','UserService', '$location', 'FlashService','RowEditor'];
	function ServicesController($rootScope,$timeout,$cookieStore,$scope,$state,$log,$http,UserService, $location,FlashService,RowEditor) {

        var vm = this;
        $rootScope.shownav=true;
        $rootScope.rootAccess =  $cookieStore.get("rootAccess");
        $rootScope.pmAccess =  $cookieStore.get("pmAccess");
        var jsonstring="";
        vm.saveservice = saveservice;
        var rowIndexTemp = 0;
        $scope.sermodel = [];
          $scope.sersettings = {
            smartButtonMaxItems: 1,
            showUncheckAll :false,
            selectionLimit: 1,
            scrollableHeight: '200px',
              scrollable: true,
            enableSearch: true,
            displayProp:'unit_code',
            idProp:'id',
            externalIdProp:'',
            closeOnBlur:true,
              
          };
          var availableOptions = "";
          $rootScope.availableOptions =  [
              {id: 'H', map_code: 'Hours'},
              {id: 'P', map_code: 'Percentage'}
            ];
            $scope.value = {
             availableOptions: $rootScope.availableOptions,
             };
        UserService.getUnits().then(function (response) {
          $scope.serdata = response.data;

          var filtered = [];
                  angular.forEach($scope.serdata, function(item) {
                    filtered.push(item);
                  });
                  filtered.sort(function (a, b) {
                    return (a.unit_name > b.unit_name? 1 : -1);
                  });
                  $scope.serdata=filtered;
        });
        
    $scope.ShowHide = function () {
                //If DIV is visible it will be hidden and vice versa.
                $scope.IsVisible = $scope.IsVisible ? false : true;
            }

     function saveservice() {
            vm.dataLoading = true;
            vm.service.unit_code=$scope.sermodel.id;
            UserService.saveService(vm.service)
                .then(function (response) {
                    if (response.data.success) {
                        FlashService.Success('Save successful', true);
                        vm.dataLoading = false;
                        UserService.getAllServices()
                          .then(function (response) {
                            $state.go("services", {}, {reload: true});
                             // vm.gridOptions.data = response.data;
                           });
                    } else {
                      if(response.data.error.service_name){
                        FlashService.Error('Service Name ' +response.data.error.service_name[0]);

                      }
                      if(response.data.error.service_code){
                        FlashService.Error('Service Code ' +response.data.error.service_code[0]);
                        
                      }
                        vm.dataLoading = false;
                    }
                });
        }


    $scope.example13model = [];

$scope.example13settings = {
	scrollableHeight: '200px',
    scrollable: true,
	enableSearch: true,
    
};

vm.gridOptions = {

    columnDefs: [
    { field: 'id', name: 'E/D', cellTemplate:'<div class="ui-grid-cell-contents"><a href="#/services/edit/{{row.entity.id}}"><button type="button" class="btn btn-xs btn-primary" ><i class="fa fa-edit"></i></button></a>&nbsp<a href="#/services/delete/{{row.entity.id}}"  ><button type="button" class="btn btn-xs danger-class"  ><i  class="fa fa-trash"></i></button></a></div>', width: 70 },
    { name: 'service_name' },
      { name: 'service_code' },
      { name: 'mapping_format' },
    ],
    enableGridMenu: true,
    enableCellEdit: false,
        
        
        

  };
  UserService.getAllServices()
     .then(function (response) {
      vm.gridOptions.data = response.data;
     });
    }



ServicesEditController.$inject = ['$scope','$log','$state','$http','UserService', '$location', 'FlashService','$timeout','$routeParams'];
function ServicesEditController($scope,$log,$state,$http,UserService, $location,FlashService,$timeout,$routeParams) {
  var vm=this;
   vm.saveservice = saveservice;
  var splits=$location.url().toString().split("/");
  console.log(splits);
  UserService.getService(splits[splits.length - 1])
                  .then(function (response) {
                      if (response.data) {
                        vm.service = response.data;
                        $scope.sermodel.id=vm.service.organisational_unit_id;
                      } 
                  });

                  function saveservice() {
            vm.dataLoading = true;
            vm.service.unit_code=$scope.sermodel.id;
            vm.service.id = splits[splits.length - 1];
            UserService.editService(vm.service)
                .then(function (response) {
                    if (response.data.id) {
                        FlashService.Success('Save successful', true);
                        vm.dataLoading = false;
                            $state.go("services", {}, {reload: true});
                    } else {
                        if(response.data.error.service_name){
                        FlashService.Error('Service Name ' +response.data.error.service_name[0]);

                      }
                      if(response.data.error.service_code){
                        FlashService.Error('Service Code ' +response.data.error.service_code[0]);
                        
                      }
                        vm.dataLoading = false;
                    }
                });
        }
  
  
      

  }

  ServicesDeleteController.$inject = ['$rootScope','$scope','$state','$log','$http','UserService', '$location', 'FlashService', 'RowEditor', '$timeout','$routeParams'];
function ServicesDeleteController($rootScope,$scope,$state,$log,$http,UserService, $location,FlashService,RowEditor,$timeout,$routeParams) {
  var vm=this;
   vm.deleteservice = deleteservice;
   
  var splits=$location.url().toString().split("/");
  $scope.deltext="";
  UserService.deleteDependency({"type":"service","data":splits[splits.length - 1]})
                  .then(function (response) {
                    if(response.data){
                      $scope.deltext="The data you are trying to delete has a dependency and will be deleted if you proceed";
                    }
                  });                 
  function deleteservice() {
              vm.dataLoading = true;
              UserService.deleteService(splits[splits.length - 1])
                  .then(function (response) {
                      if (response.status==204) {
                          FlashService.Success('Delete successful', true);
                          vm.dataLoading = false;
                          $state.go("services", {}, {reload: true});
                      } else {
                          FlashService.Error(response.message);
                          vm.dataLoading = false;
                      }
                  });
          }
  }


     
    
})();

