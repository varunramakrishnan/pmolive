// To display flash message across the apllication
(function () {
    'use strict';

    angular
        .module('app')
        .factory('FlashService', FlashService);

    FlashService.$inject = ['$rootScope','$anchorScroll','$location'];
    function FlashService($rootScope,$anchorScroll,$location) {
        var service = {};

        service.Success = Success;
        service.Error = Error;
        service.clearMessage=clearMessage;
        initService();

        return service;

        function initService() {
            $rootScope.$on('$locationChangeStart', function () {
                clearFlashMessage();
            });

            function clearFlashMessage() {
                var flash = $rootScope.flash;
                if (flash) {
                    if (!flash.keepAfterLocationChange) {
                        delete $rootScope.flash;
                    } else {
                        // only keep for a single location change
                        flash.keepAfterLocationChange = false;
                    }
                }
            }
        }
        $rootScope.MessageClear = function(){
            delete $rootScope.flash;
        }
        function clearMessage() {
            delete $rootScope.flash;
        }

        function Success(message, keepAfterLocationChange) {
            $rootScope.flash = {
                message: message,
                type: 'success', 
                keepAfterLocationChange: keepAfterLocationChange
            };
            $location.hash('topwindow');
            $anchorScroll();
        }

        function Error(message, keepAfterLocationChange) {
            $rootScope.flash = {
                message: message,
                type: 'error',
                keepAfterLocationChange: keepAfterLocationChange
            };
            $location.hash('topwindow');
            $anchorScroll();
        }
    }

})();