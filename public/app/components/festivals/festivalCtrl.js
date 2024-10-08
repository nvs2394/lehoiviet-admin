"use strict";
app.controller('festivalCtrl', ['$scope', '$http', 'DTColumnBuilder', 'DTOptionsBuilder', '$compile',
    '$filter', '$state', '$timeout', 'ConfigService','ngProgressFactory',
    function($scope, $http, DTColumnBuilder, DTOptionsBuilder, $compile, $filter, $state, $timeout, ConfigService,ngProgressFactory) {
        $scope.progressbar = ngProgressFactory.createInstance();
        $scope.progressbar.start();

        var host = ConfigService.host;

        $timeout(function() {
                $('body').tooltip({
                    selector: "[data-tooltip=tooltip]",
                    container: "body"
                });
            }, 100)
            /*all festival show to datatables*/
        $scope.dtOptions = DTOptionsBuilder.fromSource(host + '/festival/lists').withDataProp('data')
            .withOption('fnRowCallback', function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                $compile(nRow)($scope);
            })
            .withOption('bLengthChange', false)
            .withOption('order', [2, 'desc'])
        $scope.dtColumns = [
            DTColumnBuilder.newColumn('title').withTitle('Tên lễ hội').renderWith(renderTitle),
            DTColumnBuilder.newColumn('userId.email').withTitle('Người đăng'),
            DTColumnBuilder.newColumn('createAt').withTitle('Ngày đăng').renderWith(renderDate),
            DTColumnBuilder.newColumn('_id').withTitle('Chọn').renderWith(getOnlyId)
        ];

        $scope.dtInstance = {};

        /*function limit length string*/
        String.prototype.trunc = String.prototype.trunc || function(n) {
            return this.length > n ? this.substr(0, n - 1) + '...' : this.toString();
        };

        function renderTitle(data) {
            if (data != null) {
                return data.trunc(30);
            } else {
                return "Title is null"
            }
        }

        function renderDate(data) {
            return $filter('date')(new Date(data), "dd MMM yyyy HH:mm:ss");
        }

        function getOnlyId(data, type, full, meta) {
            var status = full.active;
            var isPublic = full.isPublic;
            var icon = status == 1 ? 'fa-lock' : 'fa-unlock';
            var iconIsPublic = isPublic == 1 ? 'ion-android-done' : 'ion-android-close';
            var isPinned = full.isPinned;
            var iconIsPined = isPinned == 1 ? 'ion-pin' : 'ion-minus-circled';
            return '<button class="btn btn-default fa fa-edit btn-flat"  ng-click="editFestival(\'' + data + '\')">' +
                '<button class="btn btn-default btn-flat fa fa-info-circle" data-toggle="tooltip" title="Detail" ng-click="detailFestival(\'' + data + '\')">' +
                '</button>' +
                '<button class="btn btn-default btn-flat fa fa-trash-o" data-toggle="modal" data-tooltip="tooltip"="tooltip" title="Delete" data-target="#askDelete" ng-click="deleteFestival(\'' + data + '\',' + !status + ')">' +
                '</button>' +
                '<button class="btn btn-default btn-flat ion ' + iconIsPublic + ' " data-toggle="modal" data-toggle="tooltip" title="Pulic/Unpublic" data-target="#askPublic" ng-click="setPublicFestival(\'' + data + '\',' + !isPublic + ')">' +
                '</button>' +
                '<button class="btn btn-default btn-flat ion ' + iconIsPined + ' " data-toggle="modal" data-target="#askPinPost" data-toggle="tooltip" title="Pin/Unpin" ng-click="setPinPost(\'' + data + '\',' + !isPinned + ')">' +
                '</button>';
        }

        $scope.detailFestival = function(data) {
            $state.go('home.festival.detail', { festivalId: data });
        }

        $scope.editFestival = function(data) {
            $state.go('home.festival.edit', { festivalId: data });
        }

        $scope.deleteFestival = function(data) {
            $scope.askDelete = function() {
                var festivalId = data;
                $http({
                    method: "POST",
                    url: host + '/festival/delete/admin/' + festivalId
                }).then(function successCallback(response) {
                    $timeout($scope.progressbar.complete(), 1000);
                    $scope.dtInstance.reloadData();
                    $scope.countFestivalPublic();
                    $scope.countFestival();
                }, function errorCallback(response) {

                });
            }
        }

        $scope.setPublicFestival = function(data, status) {
            $scope.isPublic = function() {
                var festivalId = data;
                $http({
                        url: host + '/festival/public/set/' + festivalId,
                        method: "POST"
                    })
                    .then(function success(response) {
                        $timeout($scope.progressbar.complete(), 1000);
                        $scope.dtInstance.reloadData();
                    }, function error(response) {

                    });
            }
        }

        $scope.setPinPost = function(data) {
            $scope.isPinned = function() {
                var festivalId = data;
                $http.post(host + '/festival/pin/set/' + festivalId)
                    .then(function success(response) {
                        $timeout($scope.progressbar.complete(), 1000);
                        $scope.dtInstance.reloadData();
                    }, function error(response) {

                    });
            }
        }

        $scope.countFestival = function() {
            $http.get(host + '/festival/count').then(function success(response) {
                $scope.totalFestival = response.data.data;
            });
        };

        $scope.countFestivalPublic = function() {
            $http.get(host + '/festival/count/ispublic').then(function success(response) {
                $timeout($scope.progressbar.complete(), 1000);
                $scope.festivalPublic = response.data.data;
            });
        };

        $scope.countPostToday = function() {
            $http.get(host + '/festival/countPostToday').then(function success(response) {
                if (response.data.data.length == 0) {
                    $scope.festivalToday = 0;
                } else {
                    $scope.festivalToday = response.data.data;
                }
            });
        };

        $http.get(host + '/province/lists').then(function success(response) {
            $scope.allProvinces = response.data.data;
        });

        $http.get(host + '/category/lists').then(function success(response) {
            $scope.allCategories = response.data.data;
        });
    }
]);
