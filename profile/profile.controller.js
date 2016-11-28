(function () {
    'use strict';

    angular
        .module('app')
        .controller('ProfileController', ProfileController);

        ProfileController.$inject = ['$filter','$rootScope','$cookieStore','$scope','$state','$http','UserService','$location'];
    function ProfileController($filter,$rootScope,$cookieStore,$scope,$state,$http,UserService,$location) {
    	var vm = this;
        $scope.emp_id = $cookieStore.get('globals').currentUser.employee_id;
        $scope.imageUrl = 'img/'+$scope.emp_id+'.png?' + new Date().getTime();
        // $scope.$apply(function () {
        //     $scope.imageUrl = $scope.imageUrl + '?' + new Date().getTime();
        // });
    	vm.savepic = savepic;

    	function savepic() {
    	if($scope.picFile){
                        UserService.saveimage($cookieStore.get('globals').currentUser.employee_id,"R",$scope.picFile)
                          .then(function (response) {
                          	$state.go("home", {}, {reload: true});
                          });
                        }
                    }

    };
    })();