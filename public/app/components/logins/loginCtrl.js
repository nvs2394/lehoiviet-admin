'use strict';
app.controller('loginCtrl', ['$scope', '$rootScope', '$http', '$state', '$window', 'loginService', '$cookies', 'ngProgressFactory',
    function($scope, $rootScope, $http, $state, $window, loginService, $cookies, ngProgressFactory) {
        $scope.progressbar = ngProgressFactory.createInstance();
        $scope.showMessage = false;
        $scope.login = function() {
            $scope.progressbar.start();
            var email = $scope.email;
            var password = $scope.password;
            var objUser = { "email": email, "password": password };
            if (email != undefined && password != undefined && email != '' && password != '') {
                var promise = loginService.login(objUser);
                promise.then(function(data) {
                    $scope.progressbar.complete();
                    if (data != undefined) {
                        if (data.message != undefined) {
                            if (data.message.code == 1) {
                                $scope.message = 'Email không đúng';
                                $scope.showMessage = true;
                                return $state.go('login');
                            }
                            if (data.message.code == 2) {
                                $scope.message = 'Sai mật khẩu';
                                $scope.showMessage = true;
                                return $state.go('login');
                            }
                            if (data.message.code == 3) {
                                $scope.message = 'Bạn không có quyền truy cập';
                                $scope.showMessage = true;
                                return $state.go('login');
                            }
                            if (data.message.code == 4) {
                                $scope.message = 'Tài khoản của bạn đang bị khóa';
                                $scope.showMessage = true;
                                return $state.go('login');
                            }
                        } else {
                            $http.defaults.headers.common['Authorization'] = $window.localStorage.token;
                            $window.localStorage.loggedUser = angular.toJson(data.user);
                            $rootScope.uid = (angular.fromJson($window.localStorage.loggedUser)._id)
                            console.log($rootScope.uid)
                            if (data.user.role == 3) {
                                $state.go('home.approve-live');
                            } else {
                                $state.go('home.index');
                            }
                        }
                    } else {
                        $scope.message = 'Đăng nhập không thành công';
                    }
                })
            } else {
                $scope.showMessage = true;
                $scope.message = 'Vui lòng nhập Email và Mật khẩu';
            }
        };
        $scope.logout = function() {
            loginService.logout();
        };
    }
]);
