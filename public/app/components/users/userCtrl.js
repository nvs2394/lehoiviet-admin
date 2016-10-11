"use strict";
app.controller('userCtrl', ['$scope', '$http', 'DTColumnBuilder', 'DTOptionsBuilder', '$compile', '$filter', '$state',
    'ConfigService', 'Notification',

    function($scope, $http, DTColumnBuilder, DTOptionsBuilder, $compile, $filter, $state, ConfigService, Notification) {
        var host = ConfigService.host;

        $scope.getAllRole = function() {
            $http.get(host + '/user/role/lists').then(function success(response) {
                $scope.allRoles = response.data.data;
            });
        }

        $scope.countTotalUser = function() {
            $http.get(host + '/user/total').then(function success(response) {
                $scope.totalUser = response.data.data;
            })
        }

        $scope.getAdmin = function() {
            $http.get(host + '/user/admin').then(function success(response) {
                $scope.totalAdmin = response.data.data;
            })
        }

        $scope.getUserInactive = function() {
            $http.get(host + '/user/inactive/lists').then(function success(response) {
                if (typeof(response.data.data) == 'object') {
                    $scope.userInactive = 0;
                } else {
                    $scope.userInactive = response.data.data;
                }
            })
        }

        //Show all user to table
        $scope.dtOptions = DTOptionsBuilder.fromSource(host + '/user/lists').withDataProp('data')
            .withOption('fnRowCallback', function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                $compile(nRow)($scope);
            })
            .withOption('bLengthChange', false)
            .withOption('order', [2, 'desc']);
        $scope.dtColumns = [
            DTColumnBuilder.newColumn('email').withTitle('email'),
            DTColumnBuilder.newColumn('role').withTitle('Vai trò').renderWith(renderRole),
            DTColumnBuilder.newColumn('createAt').withTitle('Ngày tạo').renderWith(renderDate),
            DTColumnBuilder.newColumn('_id').withTitle('Chọn').renderWith(getOnlyId)
        ];

        $scope.dtInstance = {};

        function renderRole(data) {
            if (data == 1) {
                return '<span class="badge bg-yellow">Admin</span>';
            } else {
                return '<span class="badge bg-light-blue">User</span>';
            }
        }

        function renderDate(data) {
            return $filter('date')(new Date(data), "dd MMM yyyy HH:mm:ss");
        }

        function getOnlyId(data, type, full, meta) {
            var isActive = full.isActive;
            var icon = isActive == 1 ? 'fa-unlock-alt' : 'fa-lock';
            return '<button class="btn btn-default fa fa-edit" ng-click="editUser(\'' + data + '\')">' +
                '</button>' +
                '<button class="btn btn-default fa fa-trash-o" data-toggle="modal" data-target="#askDelete"  ng-click="deleteUser(\'' + data + '\',' + !status + ')">' +
                '</button>' +
                '<button class="btn btn-default fa ' + icon + '" data-toggle="modal" data-target="#askInactive"  ng-click="isActive(\'' + data + '\',' + !isActive + ')">' +
                '</button>';
        }

        $scope.editUser = function(data) {
            $state.go('home.user.edit', { userId: data });
        }

        $scope.deleteUser = function(data) {
            $scope.askDeleteUser = function() {
                var userId = data;
                $http({
                    method: "DELETE",
                    url: host + '/user/delete/' + userId
                }).then(function successCallback(response) {
                    if (response.data.data.code == 0) {
                        Notification({ message: 'Không thể xóa Người quản trị', title: 'Warning' }, 'warning');
                    } else {
                        Notification({ message: 'Đã xóa người dùng'});
                        $scope.dtInstance.reloadData();
                        $scope.countTotalUser();
                        $scope.getAdmin();
                        $scope.getUserInactive();
                    }
                }, function errorCallback(response) {

                });
            }
        }

        $scope.isActive = function(data, isActive) {
            var userId = data;
            $scope.askInactiveUser = function() {
                var data = {};
                data.isActive = isActive;

                $http({
                    method: "POST",
                    url: host + '/user/inactive/' + userId,
                    data: data
                }).then(function successCallback(response) {
                    $scope.dtInstance.reloadData();
                    $scope.countTotalUser();
                    $scope.getAdmin();
                    $scope.getUserInactive();
                }, function errorCallback(response) {

                });
            }
        }

    }
]);
