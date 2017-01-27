(function () {
    'use strict';

    angular
        .module('app')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$rootScope','$cookieStore','$location', 'AuthenticationService', 'FlashService'];
    function LoginController($rootScope,$cookieStore,$location, AuthenticationService, FlashService) {
        var vm = this;
        $rootScope.shownav=false;
        vm.login = login;

        (function initController() {
            // reset login status
            AuthenticationService.ClearCredentials();
        })();

        function login() {
            vm.dataLoading = true;
            AuthenticationService.Login(vm.username, vm.password, function (response) {
                if (response.user.mail) {
                    AuthenticationService.SetCredentials(response.user.resource_id,vm.username, vm.password,response.access_token,response.user.resource_id,response.user.employee_id);
                    
                    $rootScope.accesstoken=response.access_token;
                    $cookieStore.put("rootAccess",0) ;
                    $cookieStore.put("pmAccess",0) ;
                    $cookieStore.put("user",0) ;
                    if(response.user.role=="0"){
                        $location.path('/home');
                       $cookieStore.put("rootAccess",1) ;
                    }else if(response.user.role=="1"){
                        $location.path('/home');
                        $cookieStore.put("pmAccess",1) ;
                    }else{
                        $location.path('/timesheet');
                        $cookieStore.put("user",1) ;
                    }
                    $rootScope.shownav=true;
                } else {
                    if (response.user.error) {
                        FlashService.Error(response.user.error);
                    } else {
                        FlashService.Error("No User Present");    
                    }
                    
                    vm.dataLoading = false;
                }
                
            });
        };
    }

})();
