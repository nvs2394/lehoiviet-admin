"use strict";
app.controller('userEditCtrl', ['$scope', '$http', '$state', 'ConfigService', function($scope, $http, $state, ConfigService) {
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

    // $scope.updateUser = function() {
    //     var data = {};
    //     data.firstName = $scope.firstname;
    //     data.lastName = $scope.lastname;
    //     data.gender = $scope.gender;
    //     data.company = $scope.company;
    //     data.description = $scope.description;
    //     data.role = $scope.roleId;
    //     $http({
    //         method: "POST",
    //         url: host + '/user/update/' + userId,
    //         data: data
    //     }).then(function successCallback(response) {
    //         $state.go('home.user');
    //     }, function errorCallback(response) {

    //     });
    // }

}]);
