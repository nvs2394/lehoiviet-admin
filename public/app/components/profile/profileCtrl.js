"use strict";
app.controller('profileCtrl', ['$scope', '$http', '$state', 'Notification', 'ConfigService', '$timeout',
    function($scope, $http, $state, Notification, ConfigService, $timeout) {
        var host = ConfigService.host;

        var userId = $state.params.userId;
        $scope.isDisableInput = true;
        $scope.isEdit = true;

        $scope.editUser = function() {
            $scope.isEdit = false;
            $scope.isDisableInput = false;
            $scope.isSave = true;
        }

        $scope.saveUser = function() {
            $scope.isDisableInput = true;
            $scope.isSave = false;
            $scope.isEdit = true;
            var data = {};
            data.firstName = $scope.firstname;
            data.lastName = $scope.lastname;
            data.gender = $scope.gender;
            data.company = $scope.company;
            data.description = $scope.description;
            $http({
                method: "POST",
                url: host + '/user/update/' + userId,
                data: data
            }).then(function successCallback(response) {
                Notification({ message: 'Update profile successfully', title: 'Success' });
                $state.go('home.profile');
            }, function errorCallback(response) {

            });
        }

        $http.get(host + '/user/show/' + userId)
            .then(function success(response) {
                var user = response.data.data;
                $scope.email = user.email;
                $scope.firstname = user.firstName;
                $scope.lastname = user.lastName;
                $scope.company = user.company;
                if (user.gender == null) {
                    $scope.gender = user.gende
                } else {
                    $scope.gender = user.gender.toString();
                }
                $scope.description = user.description;
            });

        $scope.changePassword = function() {
            if ($scope.oldPassword != undefined && $scope.oldPassword != '') {
                var data = {};
                data.oldPassword = $scope.oldPassword;
                data.newPassword = $scope.user.password;
                $http({
                    method: "POST",
                    url: host + '/user/password/change/' + userId,
                    data: data
                }).then(function successCallback(response) {
                    if (response.data.success == false) {
                        Notification({ message: 'Old password invalid', title: 'Warning' }, 'warning');
                    } else {
                        Notification({ message: 'Change password successfully', title: 'Success' });
                        $timeout(function() {
                            $state.go('login');
                        }, 2000)
                    }
                }, function errorCallback(response) {

                });
            } else {
                Notification({ message: 'Please fill password', title: 'Warning' }, 'warning');
            }
        }
    }
]);
