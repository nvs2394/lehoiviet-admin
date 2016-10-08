"use strict";
app.controller('userNewCtrl', ['$scope', '$http', '$state', 'ConfigService', function($scope, $http, $state, ConfigService) {

    var host = ConfigService.host;

    $http.get(host + '/user/role/lists').then(function success(response) {
        $scope.allRoles = response.data.data;
    });

    $scope.addNewUser = function() {
        var data = {};
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
            if (response.data.data == 0) {} else {
                $state.go('home.user');
            }
        }, function errorCallback(response) {});
    }

}]);
