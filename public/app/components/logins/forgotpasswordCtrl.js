'use strict';
app.controller('forgotpasswordCtrl', ['$scope', '$rootScope', '$http', '$state', '$window', 'loginService',
    '$cookies', 'ConfigService',
    function($scope, $rootScope, $http, $state, $window, loginService, $cookies, ConfigService) {
        $scope.rememberEmail = false;
        $scope.success = false;
        var host = ConfigService.host;
        $scope.emailPasswd = function() {
            var data = {};
            data.email = $scope.email;
            if ($scope.email != undefined) {
                $http({
                    method: "POST",
                    url: host + '/users/forgotPassword',
                    data: data
                }).then(function successCallback(response) {
                    $scope.rememberEmail = false;
                    $scope.success = true;
                }, function errorCallback(response) {});
            } else {
                $scope.rememberEmail = true;
                $scope.success = false;
            }

        };
    }
]);
