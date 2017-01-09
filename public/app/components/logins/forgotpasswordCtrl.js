'use strict';
app.controller('forgotpasswordCtrl', ['$scope', '$http', 'ConfigService',
    'ngProgressFactory', '$state',
    function($scope, $http, ConfigService, ngProgressFactory, $state) {
        $scope.progressbar = ngProgressFactory.createInstance();
        var host = ConfigService.host;
        $scope.emailPasswd = function() {
            $scope.progressbar.start();
            var data = {};
            data.email = $scope.email;
            data.host = 'cms';
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

        $scope.resetPassword = function() {
            var token = $state.params.token;
            if (token != undefined) {
                if ($scope.pw1 === $scope.pw2 && $scope.pw1 != null && $scope.pw2 != null) {
                    $scope.progressbar.start();
                    var data = {};
                    data.newPassword = $scope.pw1;
                    data.token = token;
                    $http({
                        method: "POST",
                        url: host + '/user/password/reset',
                        data: data
                    }).then(function successCallback(response) {
                        $scope.progressbar.complete();
                        var data = response.data.data.code;
                        console.log(data)
                        if (data == 1) {
                            $scope.resetDone = true;
                            setTimeout(function() {
                                $state.go('login');
                            }, 1000);
                        }
                    }, function errorCallback(response) {});
                } else {
                    $scope.alerMessage = true;
                }
            }
        }
    }
]);
