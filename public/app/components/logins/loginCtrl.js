'use strict';
app.controller('loginCtrl', ['$scope', '$rootScope', '$http', '$state', '$window', 'loginService', '$cookies', function($scope, $rootScope, $http, $state, $window, loginService, $cookies) {

    $scope.showMessage = false;
    $scope.login = function() {
        var email = $scope.email;
        var password = $scope.password;
        var objUser = { "email": email, "password": password };
        if (email != undefined && password != undefined && email != '' && password != '') {
            var promise = loginService.login(objUser);
            promise.then(function(data) {
                if (data != undefined) {
                    if (data.message != undefined) {
                        if (data.message.code == 1) {
                            $scope.message = 'Email incorrect';
                            $scope.showMessage = true;
                            return $state.go('login');
                        }
                        if (data.message.code == 2) {
                            $scope.message = 'Password incorrect';
                            $scope.showMessage = true;
                            return $state.go('login');
                        }
                        if (data.message.code == 3) {
                            $scope.message = 'Permission Denied';
                            $scope.showMessage = true;
                            return $state.go('login');
                        }
                    } else {
                        $http.defaults.headers.common['Authorization'] = $window.localStorage.token;
                        $window.localStorage.loggedUser = angular.toJson(data.user);
                        $state.go('home.index');
                    }
                } else {
                    $scope.message = 'Login false';
                }
            })
        } else {
            $scope.showMessage = true;
            $scope.message = 'Please input email and password';
        }
    };
    $scope.logout = function() {
        loginService.logout();
    };
}]);
