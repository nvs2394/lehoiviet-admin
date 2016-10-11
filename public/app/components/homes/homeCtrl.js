"use strict";
app.controller('homeCtrl', ['$scope', '$http', 'DTColumnBuilder', 'DTOptionsBuilder', '$compile',
    '$filter', '$window', 'ConfigService',
    function($scope, $http, DTColumnBuilder, DTOptionsBuilder, $compile, $filter, $window, ConfigService) {

        var host = ConfigService.host;
        $http.get(host + '/comment/count/festival').then(function success(response) {
            $scope.totalCommentPost = response.data.data;
        }, function error(response) {

        });
        $http.get(host + '/festival/count').then(function success(response) {
            $scope.totalFestival = response.data.data;
        }, function error(response) {

        });
        $http.get(host + '/blog/count').then(function success(response) {
            $scope.totalBlog = response.data.data;
        }, function error(response) {});

        $http.get(host + '/user/total').then(function success(response) {
            $scope.totalUser = response.data.data;
        }, function error(response) {

        });

        $http.get(host + '/user/top').then(function success(response) {
            $scope.topMembers = response.data.data;
        }, function error(response) {

        });

        $http.get(host + '/video/count').then(function success(response) {
            $scope.totalVideos = response.data.data;
        }, function error(response) {

        });

        $http.get(host + '/festival/like/countall').then(function success(response) {
            $scope.totalLikePost = response.data.data;
        }, function error(response) {

        });

        $scope.dtOptions = DTOptionsBuilder.fromSource(host + '/festival/pending').withDataProp('data')
            .withOption('fnRowCallback', function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                $compile(nRow)($scope);
            })
            .withOption('bLengthChange', false)
        $scope.dtColumns = [
            DTColumnBuilder.newColumn('title').withTitle('Tên').renderWith(renderTitle),
            DTColumnBuilder.newColumn('userId.name').withTitle('Người đăng'),
            DTColumnBuilder.newColumn('createAt').withTitle('Ngày đăng').renderWith(renderDate),
            DTColumnBuilder.newColumn('_id').withTitle('Chọn').renderWith(getOnlyId)
        ];

        $scope.dtInstance = {};

        //Limit string
        String.prototype.trunc = String.prototype.trunc || function(n) {
            return this.length > n ? this.substr(0, n - 1) + '...' : this.toString();
        };

        function renderTitle(data) {
            if (data != null) {
                return data.trunc(20);
            }
            return "Title null"
        }

        function renderDate(data) {
            return $filter('date')(new Date(data), "dd MMM yyyy HH:mm:ss");
        }

        function getOnlyId(data, type, full, meta) {
            var status = full.isPublic;
            var icon = status == 1 ? 'ion-android-done text-yellow' : 'ion-android-close text-aqua';
            return '<button class="btn btn-default ion ' + icon + ' " data-toggle="modal" data-target="#askPublic" ng-click="setPublicPost(\'' + data + '\',' + !status + ')">' +
                '</button>';
        }

        $scope.setPublicPost = function(data, status) {
            $scope.isPublic = function() {
                var festivalId = data;
                $http({
                        url: host + '/festival/public/set/' + festivalId,
                        method: "POST"
                    })
                    .then(function success(response) {
                        $scope.dtInstance.reloadData();
                    }, function error(response) {

                    });
            }

        }

        /*all festival show to datatables*/
        $scope.dtOptionsPinPost = DTOptionsBuilder.fromSource(host + '/festival/pin').withDataProp('data')
            .withOption('fnRowCallback', function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                $compile(nRow)($scope);
            })
            .withOption('bLengthChange', false);
        $scope.dtColumnsPinPost = [
            DTColumnBuilder.newColumn('title').withTitle('Tên').renderWith(renderTitle),
            DTColumnBuilder.newColumn('userId.name').withTitle('Người đăng'),
            DTColumnBuilder.newColumn('createAt').withTitle('Ngày đăng').renderWith(renderDate),
            DTColumnBuilder.newColumn('_id').withTitle('Chọn').renderWith(pinPost)
        ];

        $scope.dtInstancePinPost = {};

        function pinPost(data, type, full, meta) {
            var status = full.isPinned;
            var icon = status == 1 ? 'ion-pin text-yellow' : 'ion-android-close text-aqua';
            return '<button class="btn btn-default ion ' + icon + ' " data-toggle="modal" data-target="#askPinPost" ng-click="setPinPost(\'' + data + '\',' + !status + ')">' +
                '</button>';
        }

        $scope.setPinPost = function(data, status) {
            $scope.isPinned = function() {
                var User = angular.fromJson($window.localStorage.loggedUser);
                var userId = User._id;
                var festivalId = data;
                $http.get({
                        url: host + '/festival/pin/set/' + festivalId + '/' + userId,
                        method: POST
                    })
                    .then(function success(response) {
                        $scope.dtInstancePinPost.reloadData();
                    }, function error(response) {

                    });
            }
        }
    }
]);
