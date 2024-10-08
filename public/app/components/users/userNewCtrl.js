"use strict";
app.controller('userNewCtrl', ['$scope', '$http', '$state', 'ConfigService', 'Notification', 'ngProgressFactory',
    function($scope, $http, $state, ConfigService, Notification, ngProgressFactory) {
        $scope.progressbar = ngProgressFactory.createInstance();
        $scope.progressbar.start();
        var host = ConfigService.host;

        $http.get(host + '/user/role/lists').then(function success(response) {
            $scope.allRoles = response.data.data;
            $scope.progressbar.complete();
        });

        $scope.addNewUser = function() {
            var data = {};
            if ($scope.email != undefined && $scope.password != undefined && $scope.firstname != undefined && $scope.lastname != undefined &&
                $scope.company != undefined && $scope.role != undefined && $scope.description != undefined &&
                $scope.email != '' && $scope.password != '' && $scope.firstname != '' && $scope.lastname != '' &&
                $scope.company != '' && $scope.role != '' && $scope.description != '') {
                data.email = $scope.email;
                data.password = $scope.password;
                data.firstName = $scope.firstname;
                data.lastName = $scope.lastname;
                data.company = $scope.company;
                data.role = $scope.role;
                data.description = $scope.description;
                $http({
                    method: "POST",
                    url: host + '/user/create',
                    data: data
                }).then(function successCallback(response) {
                    $scope.progressbar.complete();
                    if (response.data.statusCode == 401) {
                        Notification({ message: 'Bạn không có quyền tạo tài khoản' }, 'warning');
                    } else {
                        if (response.data.data == 0) {
                            Notification({ message: 'Email này đã tồn tại' }, 'warning');
                        } else {
                            Notification({ message: 'Tạo tài khoản thành công' }, 'success');
                            $state.go('home.user');
                        }
                    }
                }, function errorCallback(response) {});
            } else {
                Notification({ message: 'Vui lòng điền đầy đủ thông tin' }, 'warning');
            }
        }

    }
]);
