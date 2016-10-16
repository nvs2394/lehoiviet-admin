app.controller('configCtrl', ['$scope', '$http', 'DTColumnBuilder', 'DTOptionsBuilder', '$compile', '$filter',
    'ConfigService', 'Notification', 'ngProgressFactory', '$timeout',
    function($scope, $http, DTColumnBuilder, DTOptionsBuilder, $compile, $filter, ConfigService, Notification, ngProgressFactory, $timeout) {
        $scope.progressbar = ngProgressFactory.createInstance();
        $scope.progressbar.start();
        $timeout(function() {
            $scope.progressbar.complete();
        }, 1000)
        var host = ConfigService.host;

        /*all categories show to datatables*/
        $scope.dtOptions = DTOptionsBuilder.fromSource(host + '/category/lists').withDataProp('data')
            .withOption('fnRowCallback', function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                $compile(nRow)($scope);
            })
            .withOption('bLengthChange', false)
            .withOption('order', [0, 'desc'])
        $scope.dtColumns = [
            DTColumnBuilder.newColumn('name').withTitle('Tên'),
            DTColumnBuilder.newColumn('description').withTitle('Mô tả'),
            DTColumnBuilder.newColumn('createAt').withTitle('Ngày tạo').renderWith(renderDate),
            DTColumnBuilder.newColumn('_id').withTitle('Chọn').renderWith(getOnlyId)
        ];

        $scope.dtInstance = {};

        function renderDate(data) {
            return $filter('date')(new Date(data), "dd MMM yyyy HH:mm:ss");
        }

        function getOnlyId(data, type, full, meta) {
            return '<button class="btn btn-default fa fa-edit btn-flat" data-toggle="modal" data-target="#editCategory"  ng-click="editCategory(\'' + data + '\')">' +
                '</button>';
        }

        $scope.editCategory = function(data) {
            var categoryId = data;
            $http({
                method: "GET",
                url: host + '/category/' + categoryId
            }).then(function successCallback(response) {
                var data = response.data.data;
                $scope.editName = data[0].name;
                $scope.editDescription = data[0].description;
                $scope.dtInstance.reloadData();
            }, function errorCallback(response) {

            });
            $scope.updateCategory = function() {
                if ($scope.editName != undefined && $scope.editName != '' && $scope.editDescription != undefined && $scope.editDescription != '') {
                    var data = {};
                    data.name = $scope.editName;
                    data.description = $scope.editDescription;
                    $http({
                        method: "POST",
                        url: host + '/category/update/' + categoryId,
                        data: data
                    }).then(function successCallback(response) {
                        $scope.dtInstance.reloadData();
                        Notification({ message: 'Chỉnh sửa danh mục thành công' }, 'success');
                        $scope.progressbar.complete();
                    }, function errorCallback(response) {});
                } else {
                    Notification({ message: 'Vui lòng nhập đầy đủ thông tin' }, 'warning');
                }
            }
        }

        $scope.addCategory = function() {
            if ($scope.name != undefined && $scope.name != '' && $scope.description != undefined && $scope.description != '') {
                var name = $scope.name;
                var description = $scope.description;
                var data = {}
                data.name = name;
                data.description = description;
                $http({
                    method: "POST",
                    url: host + '/category/create',
                    data: data
                }).then(function successCallback(response) {
                    $scope.dtInstance.reloadData();
                    Notification({ message: 'Thêm mới danh mục thành công' }, 'success');
                    $scope.progressbar.complete();
                }, function errorCallback(response) {

                });
            } else {
                Notification({ message: 'Vui lòng nhập đầy đủ thông tin' }, 'warning');
            }
        }
    }
]);
