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
 .controller('UnitController', UnitController)
 .controller('UnitEditController', UnitEditController)
 .controller('UnitDeleteController', UnitDeleteController)

.controller('RowEditCtrl', RowEditCtrl)

.service('RowEditor', RowEditor);
	UnitController.$inject = ['$rootScope','$scope','$cookieStore','$state','$log','$http','UserService', '$location', 'FlashService','RowEditor'];
	function UnitController($rootScope,$scope,$cookieStore,$state,$log,$http,UserService, $location,FlashService,RowEditor) {
		var vm = this;
    $rootScope.shownav=true;
    $rootScope.rootAccess =  $cookieStore.get("rootAccess");
    $rootScope.pmAccess =  $cookieStore.get("pmAccess");
        vm.editRow = RowEditor.editRow;
        vm.saveunit = saveunit;
        var rowIndexTemp = 0;
  var colKeyTemp = '';
  var availOrgan ='';
  var availableStatus = "";
  var availableManagers = "";  
  $scope.clickHandler = RowEditor.editRow;
  vm.gridOptions = {

    columnDefs: [
    { field: 'id',  name: 'E/D', cellTemplate:'<div class="ui-grid-cell-contents"><a href="#/units/edit/{{row.entity.id}}"><button type="button" class="btn btn-xs btn-primary"  ><i class="fa fa-edit"></i></button></a>&nbsp<a href="#/units/delete/{{row.entity.id}}"  ><button type="button" class="btn btn-xs danger-class"  ><i  class="fa fa-trash"></i></button></a></div>', width: 70 },
    { name: 'unit_name' ,width:150 },
    { name: 'unit_code' ,width:150 },
    ]

  };
  
  
  
    /*$http.get('jsonFiles/data.json')

    .success(function (data) {

      vm.gridOptions.data = data;

    });*/
      UserService.getUnits()
     .then(function (response) {
      vm.gridOptions.data = response.data;
     });
    $scope.cellValue ='';
    function saveunit() {
            vm.dataLoading = true;
            var unit={"unit_name" : vm.unit,"unit_code" : vm.unit_code}//,"services" : $scope.example13model}
            UserService.saveUnit(unit)
                .then(function (response) {
                    if (response.data.success) {
                        FlashService.Success('Save successful', true);
                        vm.dataLoading = false;
                        UserService.getUnits()
                         .then(function (response) {
                           $state.go("units", {}, {reload: true});
                         });
                    } else {
                      if(response.data.error.unit_name){
                        FlashService.Error('Organisational Unit Name ' + response.data.error.unit_name[0]);
                      }
                      if(response.data.error.unit_code){
                        FlashService.Error('Organisational Unit Code ' + response.data.error.unit_code[0]);
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
    console.log(grid);
    console.log(row);
    $modal.open({

      templateUrl: 'ounit/edit-unit-modal.html',

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
  console.log(vm.entity);
  vm.save = save;
  function save() {
    row.entity = angular.extend(row.entity, vm.entity);
    $modalInstance.close(row.entity);
    UserService.editUnit(row.entity);

  }
}
UnitEditController.$inject = ['$scope','$state','$log','$http','UserService', '$location', 'FlashService','$timeout','$routeParams'];
function UnitEditController($scope,$state,$log,$http,UserService, $location,FlashService,$timeout,$routeParams) {
  var vm=this;
   vm.saveunit = saveunit;
  var splits=$location.url().toString().split("/");
  UserService.getUnit(splits[splits.length - 1])
                  .then(function (response) {
                      if (response.data) {
                        vm.unit = response.data.unit_name;
                        vm.unit_code = response.data.unit_code;
                        //$scope.sermodel=vm.account.sermodel=
                       // vm.account.start_date=$scope.minEndDate;
             // //vm.account.end_date=$scope.maxEndDate;
             // vm.account.anticipated_value = vm.account.anticipated_value.concat(" ").concat(vm.account.anticipated_value_currency);
                      } 
                  });

                  function saveunit() {
            vm.dataLoading = true;
            var unit={"id" : splits[splits.length - 1],"unit_name" : vm.unit,"unit_code":vm.unit_code}
            UserService.editUnit(unit)
                .then(function (response) {
                    if (response.data.id) {
                        FlashService.Success('Save successful', true);
                        vm.dataLoading = false;
                        UserService.getUnits()
                         .then(function (response) {
                          $state.go("units", {}, {reload: true});
                         });
                    } else {
                        if(response.data.error.unit_name){
                        FlashService.Error('Organisational Unit Name ' + response.data.error.unit_name[0]);
                      }
                      if(response.data.error.unit_code){
                        FlashService.Error('Organisational Unit Code ' + response.data.error.unit_code[0]);
                      }
                        vm.dataLoading = false;
                    }
                });
        }
  
  
      

  }

   UnitDeleteController.$inject = ['$rootScope','$scope','$state','$log','$http','UserService', '$location', 'FlashService', 'RowEditor', '$timeout','$routeParams'];
function UnitDeleteController($rootScope,$scope,$state,$log,$http,UserService, $location,FlashService,RowEditor,$timeout,$routeParams) {
  var vm=this;
  vm.deleteunit = deleteunit;
  var splits=$location.url().toString().split("/");
  $scope.deltext="";
  UserService.deleteDependency({"type":"unit","data":splits[splits.length - 1]})
                  .then(function (response) {
                    if(response.data){
                      $scope.deltext="The data you are trying to delete has a dependency and will be deleted if you proceed";
                    }
                  });
  function deleteunit() {
              vm.dataLoading = true;
              UserService.deleteUnit(splits[splits.length - 1])
                  .then(function (response) {
                      if (response.status==204) {
                          FlashService.Success('Delete successful', true);
                          vm.dataLoading = false;
                          $state.go("units", {}, {reload: true});
                      } else {
                          FlashService.Error(response.message);
                          vm.dataLoading = false;
                      }
                  });
          }
  }
    }
)();