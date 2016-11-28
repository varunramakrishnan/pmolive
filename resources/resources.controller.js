(function () {
    'use strict';

    angular
        .module('app')
        .controller('ResourcesController', ResourcesController)
        .controller('ResourcesEditController', ResourcesEditController)
        .controller('ResourcesDeleteController', ResourcesDeleteController);
        //.controller('RowEditCtrl', RowEditCtrl)
        //.service('RowResourceEditor', RowResourceEditor)
	ResourcesController.$inject = ['$rootScope','Upload','$state','$cookieStore','$timeout','$scope','$log','$http','UserService', '$location', 'FlashService','$routeParams'];
	function ResourcesController($rootScope,Upload,$state,$cookieStore,$timeout,$scope,$log,$http,UserService, $location,FlashService,$routeParams) {

        var vm = this;
        $rootScope.shownav=true;
        $rootScope.rootAccess =  $cookieStore.get("rootAccess");
        $rootScope.pmAccess =  $cookieStore.get("pmAccess");
        var jsonstring="";
        vm.saveresource = saveresource;
        //vm.getSkilldata = getSkilldata;
        $scope.resmodel = [];
$rootScope.ressettings = $scope.ressettings = {
  scrollableHeight: '200px',
    scrollable: true,
  enableSearch: true,
  displayProp:'skill_name',
  idProp:'id',
  externalIdProp:'id',
  closeOnBlur:true
};
$scope.data = {
                          repeatSelect: null,
                          statusSelect: null,
                          managerSelect: null,
                          
                         };
        var rowIndexTemp = 0;
        // $timeout(function () {
        UserService.getHeirarchies()
                         .then(function (response) {
                          $rootScope.availableHeirarchyOptions = response.data;


                         $scope.data.availableHeirarchyOptions= $rootScope.availableHeirarchyOptions;

                          var filtered = [];
                              angular.forEach($scope.data.availableHeirarchyOptions, function(item) {
                                filtered.push(item);
                                
                              });
                              filtered.sort(function (a, b) {
                                return (a.role_name > b.role_name? 1 : -1);
                              });
                        $scope.data.availableHeirarchyOptions=filtered;
                        
                         });

                         UserService.getManagers()
                           .then(function (response) {
                            $rootScope.availableManagers = response.data.success;
                            $scope.data.availableManagerOptions = $rootScope.availableManagers;
                             
                              //console.log('here..resource..'+JSON.stringify($rootScope.availableManagers));
                            // vm.account.resource_id = {id : rid};
                           });
                       // },3000);
        // $timeout(function () {
        UserService.getSkills()
                         .then(function (response) {
                          $rootScope.availableSkillOptions = response.data;
                          $scope.data.availableSkillOptions = $rootScope.availableSkillOptions;
                          var skillArray = {}; 
                          for(var i = 0; i < response.data.length; i++) {
                          var obj = response.data[i];
                          skillArray[obj.id] = obj.skill_name;
                          }
                          $scope.resdata = response.data;
                          var filtered = [];
                            angular.forEach($scope.resdata, function(item) {
                              filtered.push(item);
                            });
                            filtered.sort(function (a, b) {
                              return (a.skill_name > b.skill_name? 1 : -1);
                            });
                      $scope.resdata=filtered;


                         });
                       // },3000);
    //$scope.clickResourceHandler = RowResourceEditor.editRow;
		$scope.eventDetails = eventDetails;
        $scope.message = 'Look! I am a Resource page.';

       /* function getSkilldata(){
          return "are";
        }*/
        
    $scope.ShowHide = function () {
                //If DIV is visible it will be hidden and vice versa.
                $scope.IsVisible = $scope.IsVisible ? false : true;
            }

     function saveresource() {
            vm.dataLoading = true;
             var file = $scope.picFile;
             
             // file.upload = Upload.upload({
             //    url: 'img',
             //    data: {file: file},
             //  });
             
                  // console.log(response);

              // file.upload.then(function (response) {
              //   console.log(response);
              //   $timeout(function () {
              //     file.result = response.data;
              //   });
              // }, function (response) {
              //   if (response.status > 0)
              //     $scope.errorMsg = response.status + ': ' + response.data;
              // }, function (evt) {
              //   // Math.min is to fix IE which reports 200% sometimes
              //   file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
              // });
            vm.resource.resmodel=$scope.resmodel;


            UserService.saveResource(vm.resource)
                .then(function (response) {
                    if (response.data.success) {
                      if($scope.picFile){
                        UserService.saveimage(vm.resource.employee_id,"R",$scope.picFile)
                          .then(function (response) {
                          });
                        }
                        FlashService.Success('Save successful', true);
                        vm.dataLoading = false;
                        // UserService.getResources()
                          // .then(function (response) {
                            $state.go("resources", {}, {reload: true});
                           // });
                    } else {
                      if(response.data.error.employee_id){
                        FlashService.Error('Employee ID ' +response.data.error.employee_id[0]);
                      }
                      if(response.data.error.heirarchy_name){
                        FlashService.Error('Heirarchy Name ' +response.data.error.heirarchy_name[0]);
                      }
                        vm.dataLoading = false;
                    }
                });

        }

    function eventDetails(event){
       $scope.selected = event;
       $scope.query = event;
      
    }

    $scope.example13model = [];
$scope.example13settings = {
	scrollableHeight: '200px',
    scrollable: true,
	enableSearch: true,
    
};
$scope.$scope = $scope;
vm.gridOptions = {
   enableColumnResizing: true,
   enableCellEdit: false,
    columnDefs: [
    { field: 'id',name: 'E/D',  cellTemplate:'<div class="ui-grid-cell-contents"><a href="#/resources/edit/{{row.entity.id}}"><button type="button" class="btn btn-xs btn-primary" ><i class="fa fa-edit"></i></button></a>&nbsp<a href="#/resources/delete/{{row.entity.id}}"  ><button type="button" class="btn btn-xs danger-class"  ><i  class="fa fa-trash"></i></button></a></div>', width: 70 },
    { field: 'DP',name: 'Profile',  cellTemplate:'<img class="gridthumb" ng-src="img/{{row.entity.employee_id}}.png" onerror="this.src=\'img/default.png\'" lazy-src />', width: 70 },
    // { field: 'DP',name: 'Profile',  cellTemplate:'<img class="gridthumb" src="img/{{grid.appScope.imgexists(row.entity.employee_id)}}.png">', width: 70 },
    { name: 'employee_name', width: 260 },
      { name: 'employee_id' , width: 130},
      { name: 'role' , width: 180},
      // { name: 'heirarchy_id' , width: 140},
      { name: 'skill', enableColumnResizing: true },
      {name: 'manager_name',width: 180},
    ],
        enableColumnHeavyVirt: true,
        virtualizationThreshold: 10,

  };
  $scope.imgexists = function(id) {
    if(id !== undefined){
        // return "default";
        var http = new XMLHttpRequest();
    var image_url  = "img/"+id+".png";
    http.open('HEAD', image_url, false);
    http.send();
    if(http.status != 404){
      return true;
    }else{
      return false;
    }
  }else{
      return false;
  }
      }; 
      

  //vm.gridOptions.columnDefs[6].visible = false;
  UserService.getResources()
     .then(function (response) {
      vm.gridOptions.data = response.data;

     });
    }

ResourcesEditController.$inject = ['$scope','$state','$rootScope','$log','$http','UserService', '$location', 'FlashService','$timeout','$routeParams'];
function ResourcesEditController($scope,$state,$rootScope,$log,$http,UserService, $location,FlashService,$timeout,$routeParams) {
  var vm=this;
   vm.saveresource = saveresource;
  var splits=$location.url().toString().split("/");
  console.log(splits);
  $scope.edit = 1;
  UserService.getResource(splits[splits.length - 1])
                  .then(function (response) {
                      if (response.data) {
                        vm.resource = response.data;
                        
                        $scope.resmodel=vm.resource.skill_id;
                        var hid=vm.resource.heirarchy_id;
                        if(hid !== null){
                              vm.resource.heirarchy_id = String(hid);
                            }
                            var rid=vm.resource.manager_id;
                            if(rid !== null){
                              vm.resource.manager_id = String(rid);
                            }
                              
                        // $scope.resmodel=vm.resource.resmodel;
                        //$scope.sermodel=vm.account.sermodel=
                       // vm.account.start_date=$scope.minEndDate;
             // //vm.account.end_date=$scope.maxEndDate;
             // vm.account.anticipated_value = vm.account.anticipated_value.concat(" ").concat(vm.account.anticipated_value_currency);
                      } 
                  });

                  function saveresource() {
            vm.dataLoading = true;
            vm.resource.resmodel=$scope.resmodel;


for(var i = 0; i < $rootScope.availableHeirarchyOptions.length; i++)
{
  if($rootScope.availableHeirarchyOptions[i].id == vm.resource.heirarchy_id)
  {
    vm.resource.role= $rootScope.availableHeirarchyOptions[i].role_name;
  }
}
// for(var i = 0; i < $rootScope.availableManagerOptions.length; i++)
// {
//   if($rootScope.availableManagerOptions[i].id == vm.resource.employee_id)
//   {
//     vm.resource.resource_name= $rootScope.availableManagerOptions[i].employee_name;
//   }
// }



            vm.resource.id=splits[splits.length - 1];
            var file = $scope.picFile;
             
            UserService.editResource(vm.resource)
                .then(function (response) {
                    if (response.data.success) {
                      if($scope.picFile){
                        UserService.saveimage(vm.resource.employee_id,"R",$scope.picFile)
                          .then(function (response) {
                          });
                        }
                        FlashService.Success('Save successful', true);
                        vm.dataLoading = false;
                        // UserService.getResources()
                          // .then(function (response) {
                            $state.go("resources", {}, {reload: true});
                           // });
                    } else {
                      if(response.data.error.employee_id){
                        FlashService.Error('Employee ID ' +response.data.error.employee_id[0]);
                      }
                      if(response.data.error.heirarchy_name){
                        FlashService.Error('Heirarchy Name  ' +response.data.error.heirarchy_name[0]);
                      }
                        vm.dataLoading = false;
                    }
                });
        }
  
  
      

  }



ResourcesDeleteController.$inject = ['$rootScope','$scope','$state','$log','$http','UserService', '$location', 'FlashService', 'RowEditor', '$timeout','$routeParams'];
function ResourcesDeleteController($rootScope,$scope,$state,$log,$http,UserService, $location,FlashService,RowEditor,$timeout,$routeParams) {
  var vm=this;
   vm.deleteresource = deleteresource;
   $scope.deltext="";
  var splits=$location.url().toString().split("/");
  UserService.deleteDependency({"type":"resource","data":splits[splits.length - 1]})
                  .then(function (response) {
                    if(response.data){
                      $scope.deltext="The data you are trying to delete has a dependency and will be deleted if you proceed";
                    }
                  });
  function deleteresource() {
          vm.dataLoading = true;
              UserService.deleteResource(splits[splits.length - 1])
                  .then(function (response) {
                    console.log(response.status);
                      if (response.status==204) {
                          FlashService.Success('Delete successful', true);
                          vm.dataLoading = false;
                          $state.go("resources", {}, {reload: true});
                          // UserService.getAccounts()
                          //   .then(function (response) {
                          //      vm.gridOptions.data = response.data;
                          //    });
                      } else {
                          FlashService.Error(response.message);
                          vm.dataLoading = false;
                      }
                      // $state.go("account");
                  });
              
          }
  }

     
    
})();

