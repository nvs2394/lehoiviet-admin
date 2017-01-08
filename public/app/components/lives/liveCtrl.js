app.controller('liveCtrl', ['$scope', '$rootScope', '$http', 'DTColumnBuilder', 'DTOptionsBuilder',
    '$compile', '$filter', 'ConfigService', '$window','$state',
    function($scope, $rootScope, $http, DTColumnBuilder, DTOptionsBuilder, $compile, $filter, ConfigService, $window,$state) {
        var host = ConfigService.host;

        var userId = angular.fromJson($window.localStorage.loggedUser)._id;

        $scope.dtOptions = DTOptionsBuilder
            .fromSource(host + '/festival/lists/' + userId)
            .withDataProp('data')
            .withOption('fnRowCallback', function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                $compile(nRow)($scope);
            })
            .withOption('bLengthChange', false)
            // .withOption('order', [0, 'desc'])
        $scope.dtColumns = [
            DTColumnBuilder.newColumn('title').withTitle('Tên lễ hội'),
            DTColumnBuilder.newColumn('address.city').withTitle('Địa điểm'),
            DTColumnBuilder.newColumn('status').withTitle('Trạng thái').renderWith(renderStatus),
            DTColumnBuilder.newColumn('_id').withTitle('Chức năng').renderWith(getOnlyId)
        ];

        $scope.dtInstance = {};

        function getOnlyId(data, type, full, meta) {
            return '<button class="btn btn-default fa fa-video-camera" data-toggle="modal" data-target="#approve-live"  ng-click="approveUserLive(\'' + data + '\')">' +
                '</button>' +
                '<button class="btn btn-default fa fa-info-circle" data-toggle="tooltip" title="Detail" ng-click="detailFestival(\'' + data + '\')">';
        }

        function renderStatus(data) {
            if (data === 3) {
                return '<span class="badge bg-yellow">Đã duyệt</span>';
            }
        }

        $scope.detailFestival = function(festivalId) {
            $state.go('home.festival.detail', { festivalId: festivalId });
        }


        $scope.approveUserLive = function(festivalId) {
            $scope.getPending(festivalId);
            $scope.changeStatusApprove = function(userId, status) {
                var data = {
                    userId: userId,
                    status: status,
                    festivalId: festivalId
                }
                $http({
                    method: "POST",
                    url: host + '/live/approve',
                    data: data
                }).then(function successCallback(response) {
                    $scope.getPending(festivalId);
                }, function errorCallback(response) {

                });
            }
        }

        $scope.getPending = function(festivalId) {
            $http.get(host + '/live/pending/' + festivalId).then(function success(response) {
                $scope.allPending = response.data.data.cameraMen;
            }, function error(response) {});
        }
    }
]);
