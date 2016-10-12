"use strict";
app.controller('userEditCtrl', ['$scope', '$http', '$state', 'ConfigService', 'Notification',
    function($scope, $http, $state, ConfigService, Notification) {
        var userId = $state.params.userId;
        var host = ConfigService.host;


        $http.get(host + '/user/role/lists').then(function success(response) {
            $scope.allRoles = response.data.data;
        });

        $http.get(host + '/user/show/' + userId)
            .then(function success(response) {
                $scope.email = response.data.data.email;
                $scope.firstname = response.data.data.firstName;
                $scope.lastname = response.data.data.lastName;
                $scope.company = response.data.data.company;
                $scope.roleId = response.data.data.role.toString();
                $scope.description = response.data.data.description;
            });

        $scope.updateUser = function() {
            var data = {};
            data.role = $scope.roleId;
            $http({
                method: "POST",
                url: host + '/user/updateUserAdmin/' + userId,
                data: data
            }).then(function successCallback(response) {
                if (response.data.statusCode == 401) {
                    Notification({ message: 'Bạn không có quyền' }, 'warning');
                } else {
                    Notification({ message: 'Đã thiết lập quyền thành công' }, 'warning');
                    $state.go('home.user');
                }
            }, function errorCallback(response) {

            });
        }

    }
]);
