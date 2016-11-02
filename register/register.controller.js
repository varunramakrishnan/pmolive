(function () {
    'use strict';

    angular
        .module('app')
        .controller('RegisterController', RegisterController);

    RegisterController.$inject = ['UserService', '$cookieStore','$location', '$rootScope', 'FlashService'];
    function RegisterController(UserService,$cookieStore, $location, $rootScope, FlashService) {
        var vm = this;

        vm.register = register;

        function register() {
            vm.dataLoading = true;
            UserService.Create(JSON.stringify(vm.userdetails))
                .then(function (response) {
                    console.log(response.data);
                    if (response.data.success) {
                        FlashService.Success('Registration successful', true);
                        $location.path('/login');
                    } else {
                        FlashService.Error('Username '+response.data.error.username[0]);
                        vm.dataLoading = false;
                    }
                });
        }
    }

})();
