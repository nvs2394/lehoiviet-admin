'use strict';
app.controller('forgotpasswordCtrl', ['$scope', '$http', 'ConfigService', 'ngProgressFactory',
    function($scope, $http, ConfigService, ngProgressFactory) {
        $scope.progressbar = ngProgressFactory.createInstance();

        var host = ConfigService.host;
        $scope.emailPasswd = function() {
            $scope.progressbar.start();
            var data = {};
            data.email = $scope.email;
            if ($scope.email != undefined && $scope.email != '') {
                $http({
                    method: "POST",
                    url: host + '/user/password/forgot',
                    data: data
                }).then(function successCallback(response) {
                    $scope.progressbar.complete();
                    $scope.rememberEmail = false;
                    if (response.data.data.code == 0) {
                        $scope.errFalse = true;
                        $scope.success = false;
                    } else {
                        $scope.errFalse = false;
                        $scope.success = true;
                    }
                }, function errorCallback(response) {});
            } else {
                $scope.errFalse = false;
                $scope.success = false;
                $scope.rememberEmail = true;
            }

        };
    }
]);
