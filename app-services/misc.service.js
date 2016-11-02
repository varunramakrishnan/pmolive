(function () {
    'use strict';

    angular
        .module('app')
        .factory('MiscService', MiscService);

    MiscService.$inject = ['$cookieStore','$http','$timeout', '$filter', '$q'];
    function MiscService($cookieStore,$http,$timeout, $filter, $q) {
        var service = {};
        var hostName='localhost';
        var globals=$cookieStore.get('globals');
        service.saveTimeCard = saveTimeCard;
        return service;
        function saveTimeCard(data) {
            var req = {
                method: 'POST',
                url: 'http://'+hostName+':3000/save-timecard.json',
                headers : { 'Content-Type': 'application/json;',
                "accessToken" : $cookieStore.get('globals').currentUser.accesstoken  } ,
                data : {"time_track" : data},
            }
            return $http(req).then(function(response){return response;},function(response){return response;});
        }
    }

})();
