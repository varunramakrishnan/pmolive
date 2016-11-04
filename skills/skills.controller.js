(function () {
    'use strict';

    angular
        .module('app')
        .controller('SkillController', SkillController)
        .controller('SkillEditController', SkillEditController)
        .controller('SkillDeleteController', SkillDeleteController);
        // .controller('RowEditCtrl', RowEditCtrl)
        // .service('RowEditor', RowEditor);
	SkillController.$inject = ['$rootScope','$timeout','$cookieStore','$scope','$state','$log','$http','UserService', '$location', 'FlashService','RowEditor'];
	function SkillController($rootScope,$timeout,$cookieStore,$scope,$state,$log,$http,UserService, $location,FlashService,RowEditor) {

        var vm = this;
        $rootScope.shownav=true;
        $rootScope.rootAccess =  $cookieStore.get("rootAccess");
        $rootScope.pmAccess =  $cookieStore.get("pmAccess");
        var jsonstring="";
        vm.saveskill = saveskill;
        var rowIndexTemp = 0;
        $rootScope.availableSkillOptions = [
      {id: 'Technical', skill_type: 'Technical'},
      {id: 'Soft Skill', skill_type: 'Soft Skill'}
    ];

        /*$scope.data = {
                          repeatSelect: null,
                          statusSelect: null,
                          managerSelect: null,
                          availableSkillOptions: $rootScope.availableSkillOptions,
                         };*/
        $timeout(function () {
        UserService.getSkills()
                         .then(function (response) {
                          $scope.data = {
                          repeatSelect: null,
                          statusSelect: null,
                          managerSelect: null,
                          availableSkillOptions: $rootScope.availableSkillOptions,
                         };
                         });
                       },3000);
    $scope.clickHandler = RowEditor.editRow;
		$scope.eventDetails = eventDetails;
    $scope.message = 'Look! I am a Resource page.';
        
    $scope.ShowHide = function () {
                //If DIV is visible it will be hidden and vice versa.
                $scope.IsVisible = $scope.IsVisible ? false : true;
            }
    $scope.isDisabled = function (type) {
                if((type == 'Technical') || (type == 'Soft Skill')){
                  return false;
                }
                return true;
            }
            

     function saveskill() {
            vm.dataLoading = true;
            UserService.saveSkill(vm.skill)
                .then(function (response) {
                    if (response.data.success) {
                        FlashService.Success('Save successful', true);
                        vm.dataLoading = false;
                        UserService.getSkills()
                          .then(function (response) {
                            $state.go("skill", {}, {reload: true});
                             // vm.gridOptions.data = response.data;
                           });
                    } else {
                      if(response.data.error.skill_name){
                        FlashService.Error('Skill Name ' +response.data.error.skill_name[0]);                        
                      }
                     if(response.data.error.skill_code){
                        FlashService.Error('Skill Code ' +response.data.error.skill_code[0]);                        
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
$scope.example13data = [
    {id: 1, label: "David"},
    {id: 2, label: "Jhon"},
    {id: 3, label: "Lisa"},
    {id: 4, label: "Nicole"},
    {id: 5, label: "Danny"}];

$scope.example13settings = {
	scrollableHeight: '200px',
    scrollable: true,
	enableSearch: true,
    
};

vm.gridOptions = {

    columnDefs: [
    { field: 'id', name: 'E/D', cellTemplate:'<div class="ui-grid-cell-contents"><a href="#/skill/edit/{{row.entity.id}}" ng-hide = "grid.appScope.isDisabled(row.entity.skill_type)" ><button type="button"  class="btn btn-xs btn-primary" ><i class="fa fa-edit"></i></button></a>&nbsp<a href="#/skill/delete/{{row.entity.id}}"  ><button type="button" class="btn btn-xs danger-class"  ><i  class="fa fa-trash"></i></button></a></div>', width: 70 },
    { name: 'skill_name' },
      { name: 'skill_type' },
      { name: 'skill_code' },
    ]

  };
  UserService.getSkills()
     .then(function (response) {
      vm.gridOptions.data = response.data;
     });
    }




SkillEditController.$inject = ['$scope','$log','$state','$http','UserService', '$location', 'FlashService','$timeout','$routeParams'];
function SkillEditController($scope,$log,$state,$http,UserService, $location,FlashService,$timeout,$routeParams) {
  var vm=this;
   vm.saveskill = saveskill;
  var splits=$location.url().toString().split("/");
  console.log(splits);
  UserService.getSkill(splits[splits.length - 1])
                  .then(function (response) {
                      if (response.data) {
                        if((response.data.skill_type == "Technical") || (response.data.skill_type == "Soft Skill")){
                          vm.skill = response.data;
                        }else{
                           $state.go("skill", {}, {reload: true});
                        }
                      } 
                  });

                  function saveskill() {
            vm.dataLoading = true;
            vm.skill.id = splits[splits.length - 1];
            UserService.editSkill(vm.skill)
                .then(function (response) {
                    if (response.data.id) {
                        FlashService.Success('Save successful', true);
                        vm.dataLoading = false;
                        UserService.getSkills()
                          .then(function (response) {
                            $state.go("skill", {}, {reload: true});
                             // vm.gridOptions.data = response.data;
                           });
                    } else {
                        if(response.data.error.skill_name){
                        FlashService.Error('Skill Name ' +response.data.error.skill_name[0]);                        
                      }
                     if(response.data.error.skill_code){
                        FlashService.Error('Skill Code ' +response.data.error.skill_code[0]);                        
                      }
                        vm.dataLoading = false;
                    }
                });
        }
  
  
      

  }

SkillDeleteController.$inject = ['$rootScope','$scope','$state','$log','$http','UserService', '$location', 'FlashService', 'RowEditor', '$timeout','$routeParams'];
function SkillDeleteController($rootScope,$scope,$state,$log,$http,UserService, $location,FlashService,RowEditor,$timeout,$routeParams) {
  var vm=this;
   vm.deleteskill = deleteskill;
   
  var splits=$location.url().toString().split("/");
  $scope.deltext="";
  UserService.deleteDependency({"type":"skill","data":splits[splits.length - 1]})
                  .then(function (response) {
                    if(response.data){
                      $scope.deltext="The data you are trying to delete has a dependency and will be deleted if you proceed";
                    }
                  });                     
  function deleteskill() {
              vm.dataLoading = true;
              UserService.deleteSkill(splits[splits.length - 1])
                  .then(function (response) {
                      if (response.status==204) {
                          FlashService.Success('Delete successful', true);
                          vm.dataLoading = false;
                          $state.go("skill", {}, {reload: true});
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

