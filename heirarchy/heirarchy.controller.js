(function () {
    'use strict';

    angular
        .module('app')
        .constant('PersonSchema', {

  type: 'object',

  properties: {

    accountName: { type: 'string', title: 'Account Name' },

    organisationalUnit: { type: 'string', title: 'Organisational Unit' },

    noOfResources: { type: 'string', title: 'No Of Resources' },

    manager: { type: 'string', title: 'Manager' },

    status: { type: 'string', title: 'Status' }

  }

})
 .controller('HeirarchyController', HeirarchyController)
 .controller('HeirarchyEditController', HeirarchyEditController)
 .controller('HeirarchyDeleteController', HeirarchyDeleteController)
 

.controller('RowEditCtrl', RowEditCtrl)

.service('RowEditor', RowEditor);
	HeirarchyController.$inject = ['$rootScope','$cookieStore','$scope','$log','$http','UserService', '$location', 'FlashService','RowEditor','$state'];
	function HeirarchyController($rootScope,$cookieStore,$scope,$log,$http,UserService, $location,FlashService,RowEditor,$state) {
		var vm = this;
    $rootScope.shownav=true;
    $rootScope.rootAccess =  $cookieStore.get("rootAccess");
    $rootScope.pmAccess =  $cookieStore.get("pmAccess");
        vm.editRow = RowEditor.editRow;
        vm.saveheirarchy = saveheirarchy;
        var rowIndexTemp = 0;
  var colKeyTemp = '';
  $scope.clickHandler = RowEditor.editRow;
  vm.gridOptions = {

    columnDefs: [
    { field: 'id', name: 'E/D', cellTemplate:'<div class="ui-grid-cell-contents"><a href="#/roles/edit/{{row.entity.id}}"><button type="button" class="btn btn-xs btn-primary" ><i class="fa fa-edit"></i></button></a>&nbsp<a href="#/roles/delete/{{row.entity.id}}"  ><button type="button" class="btn btn-xs danger-class"  ><i  class="fa fa-trash"></i></button></a></div>', width: 80 },
    { name: 'role_name' ,width:150},
    { name: 'role_code' ,width:150},
    { name: 'heirarchy_id' ,width:150},
    ]

  };
  
    /*$http.get('jsonFiles/data.json')

    .success(function (data) {

      vm.gridOptions.data = data;

    });*/
      UserService.getHeirarchies()
     .then(function (response) {
      vm.gridOptions.data = response.data;
     });
    $scope.cellValue ='';
    function saveheirarchy() {
            vm.dataLoading = true;
            var unit={"role_name" : vm.heirarchy,"role_code" : vm.role_code,"heirarchy_id":vm.heirarchy_id}
            UserService.saveHeirarchies(unit)
                .then(function (response) {
                    if (response.data.success) {
                        FlashService.Success('Save successful', true);
                        vm.dataLoading = false;
                        // UserService.getHeirarchies()
                        //  .then(function (response) {
                          $state.go("roles", {}, {reload: true});
                          // vm.gridOptions.data = response.data;
                          // console.log(vm.gridOptions);
                         // });
                    } else {
                      if(response.data.error.heirarchy_id){
                        FlashService.Error('Heirarchy ID ' + response.data.error.heirarchy_id[0]);
                      }
                      if(response.data.error.role_code){
                        FlashService.Error('Role Code ' + response.data.error.role_code[0]);
                      }
                        
                        vm.dataLoading = false;

                    }
                });
        }
    $scope.IsVisible = false;
            $scope.ShowHide = function () {
                //If DIV is visible it will be hidden and vice versa.
                $scope.IsVisible = $scope.IsVisible ? false : true;
            }
}

RowEditor.$inject = ['$rootScope', '$modal','UserService'];

function RowEditor($rootScope, $modal,UserService) {

  var service = {};

  service.editRow = editRow;

  

  function editRow(grid, row) {
    $modal.open({

      templateUrl: 'heirarchy/edit-heirarchy-modal.html',

      controller: ['$modalInstance', '$rootScope','PersonSchema', 'grid', 'row','UserService', RowEditCtrl],

      controllerAs: 'vm',

      resolve: {

        grid: function () { return grid; },

        row: function () { return row; }

      }

    });

  }

  

  return service;

}
function RowEditCtrl($modalInstance, $rootScope,PersonSchema, grid, row ,UserService) {

  var vm = this;
  vm.schema = PersonSchema;
  vm.entity = angular.copy(row.entity);
  vm.save = save;
  function save() {
    row.entity = angular.extend(row.entity, vm.entity);
    $modalInstance.close(row.entity);
    UserService.editUnit(row.entity);

  }
}

HeirarchyEditController.$inject = ['$scope','$state','$log','$http','UserService', '$location', 'FlashService','$timeout','$routeParams'];
function HeirarchyEditController($scope,$state,$log,$http,UserService, $location,FlashService,$timeout,$routeParams) {
  var vm=this;
   vm.saveheirarchy = saveheirarchy;
  var splits=$location.url().toString().split("/");
  UserService.getHeirarchy(splits[splits.length - 1])
                  .then(function (response) {
                      if (response.data) {
                        vm.heirarchy = response.data.role_name;
                        vm.role_code = response.data.role_code;
                        vm.heirarchy_id = response.data.heirarchy_id;
                        
                        //$scope.sermodel=vm.account.sermodel=
                       // vm.account.start_date=$scope.minEndDate;
             // //vm.account.end_date=$scope.maxEndDate;
             // vm.account.anticipated_value = vm.account.anticipated_value.concat(" ").concat(vm.account.anticipated_value_currency);
                      } 
                  });

                  function saveheirarchy() {
            vm.dataLoading = true;
            var unit={"id":splits[splits.length - 1],"role_name" : vm.heirarchy,"role_code" : vm.role_code,"heirarchy_id":vm.heirarchy_id}
            UserService.editHeirarchy(unit)
                .then(function (response) {
                    if (response.data.id) {
                        FlashService.Success('Save successful', true);
                        vm.dataLoading = false;
                        //UserService.getHeirarchies()
                         //.then(function (response) {
                          $state.go("roles", {}, {reload: true});
                          //vm.gridOptions.data = response.data;
                         //});
                    } else {
                      if(response.data.error.role_code){
                        FlashService.Error('Role Code ' + response.data.error.role_code[0]);
                      }
                      if(response.data.error.heirarchy_id){
                        FlashService.Error('Heirarchy ID ' + response.data.error.heirarchy_id[0]);
                      }
                        vm.dataLoading = false;
                    }
                });
        }
  
  
      

  }

  HeirarchyDeleteController.$inject = ['$rootScope','$scope','$state','$log','$http','UserService', '$location', 'FlashService', 'RowEditor', '$timeout','$routeParams'];
function HeirarchyDeleteController($rootScope,$scope,$state,$log,$http,UserService, $location,FlashService,RowEditor,$timeout,$routeParams) {
  var vm=this;
   vm.deleterole = deleterole;
   
  var splits=$location.url().toString().split("/");
  $scope.deltext="";
  UserService.deleteDependency({"type":"role","data":splits[splits.length - 1]})
                  .then(function (response) {
                    if(response.data){
                      $scope.deltext="The data you are trying to delete has a dependency and will be deleted if you proceed";
                    }
                  });                      
  function deleterole() {
              vm.dataLoading = true;
              UserService.deleteRole(splits[splits.length - 1])
                  .then(function (response) {
                      if (response.status==204) {
                          FlashService.Success('Delete successful', true);
                          vm.dataLoading = false;
                          $state.go("roles", {}, {reload: true});
                      } else {
                          FlashService.Error(response.message);
                          vm.dataLoading = false;
                      }
                  });
          }
  }


    }
)();