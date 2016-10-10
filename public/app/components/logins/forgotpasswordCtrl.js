'use strict';
app.controller('forgotpasswordCtrl', ['$scope', '$http', 'ConfigService',
    function($scope, $http, ConfigService) {
        var host = ConfigService.host;
        $scope.emailPasswd = function() {
            var data = {};
            data.email = $scope.email;
            if ($scope.email != undefined && $scope.email != '') {
                $http({
                    method: "POST",
                    url: host + '/user/password/forgot',
                    data: data
                }).then(function successCallback(response) {
                    $scope.rememberEmail = false;
                    console.log(response.data.data.code);
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
