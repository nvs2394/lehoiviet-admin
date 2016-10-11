app.controller('configCtrl', ['$scope', '$http', 'DTColumnBuilder', 'DTOptionsBuilder', '$compile', '$filter',
    'ConfigService',
    function($scope, $http, DTColumnBuilder, DTOptionsBuilder, $compile, $filter, ConfigService) {

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
            var status = full.active;
            var isPublic = full.isPublic;
            var icon = status == 1 ? 'fa-lock' : 'fa-unlock';
            var iconIsPublic = isPublic == 1 ? 'ion-android-done' : 'ion-android-close';
            return '<button class="btn btn-default fa fa-edit" data-toggle="modal" data-target="#editCategory"  ng-click="editCategory(\'' + data + '\')">' +
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
                var data = {};
                data.name = $scope.editName;
                data.description = $scope.editDescription;
                $http({
                    method: "POST",
                    url: host + '/category/update/' + categoryId,
                    data: data
                }).then(function successCallback(response) {
                    $scope.dtInstance.reloadData();
                }, function errorCallback(response) {

                });
            }
        }

        $scope.addCategory = function() {
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
            }, function errorCallback(response) {

            });
        }
    }
]);
