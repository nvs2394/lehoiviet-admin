app.controller('commentCtrl', ['$scope', '$http', 'DTColumnBuilder', 'DTOptionsBuilder', '$compile', '$filter', 'ConfigService',
    function($scope, $http, DTColumnBuilder, DTOptionsBuilder, $compile, $filter, ConfigService) {
        var host = ConfigService.host;
        $http({
            method: "GET",
            url: host + '/comment/count/festival'
        }).then(function successCallback(response) {
            $scope.allCommentPost = response.data.data;
        }, function errorCallback(response) {

        });

        $http({
            method: "GET",
            url: host + '/comment/count/blog'
        }).then(function successCallback(response) {
            $scope.allCommentBlog = response.data.data;
        }, function errorCallback(response) {

        });


        //Comment Festival
        $scope.dtOptions = DTOptionsBuilder.fromSource(host + '/comment/lists/festival').withDataProp('data')
            .withOption('fnRowCallback', function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                $compile(nRow)($scope);
            })
            .withOption('bLengthChange', false)
            .withOption('order', [0, 'desc'])
        $scope.dtColumns = [
            DTColumnBuilder.newColumn('content').withTitle('Content'),
            DTColumnBuilder.newColumn('userId.email').withTitle('Email'),
            DTColumnBuilder.newColumn('createAt').withTitle('Created At').renderWith(renderDate),
            DTColumnBuilder.newColumn('_id').withTitle('Actions').renderWith(getOnlyId)
        ];

        $scope.dtInstance = {};

        function renderDate(data) {
            return $filter('date')(new Date(data), "dd MMM yyyy HH:mm:ss");
        }

        function getOnlyId(data, type, full, meta) {
            return '<button class="btn btn-default fa fa-trash-o" data-toggle="modal" data-target="#askPost"  ng-click="deleteCommentPost(\'' + data + '\')">' +
                '</button>';
        }

        $scope.deleteCommentPost = function(data) {
            var commentId = data;
            $scope.askDeleteCommentPost = function() {
                var data = {};
                data.type = "Posts";
                $http({
                    method: "POST",
                    url: '../api/comment/delete/' + commentId,
                    withCredentials: true,
                    data: data
                }).then(function successCallback(response) {
                    $scope.dtInstance.reloadData();
                }, function errorCallback(response) {});
            }
        }

        //Comment Blog
        $scope.dtOptionsBlog = DTOptionsBuilder.fromSource(host + '/comment/lists/blog').withDataProp('data')
            .withOption('fnRowCallback', function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                $compile(nRow)($scope);
            })
            .withOption('bLengthChange', false)
            .withOption('order', [0, 'desc'])
        $scope.dtColumnsBlog = [
            DTColumnBuilder.newColumn('content').withTitle('Content'),
            DTColumnBuilder.newColumn('userId.email').withTitle('Email'),
            DTColumnBuilder.newColumn('createAt').withTitle('Created At').renderWith(renderDate),
            DTColumnBuilder.newColumn('_id').withTitle('Actions').renderWith(getOnlyIdBlog)
        ];

        $scope.dtInstanceBlog = {};

        function getOnlyIdBlog(data, type, full, meta) {
            return '<button class="btn btn-default fa fa-trash-o" data-toggle="modal" data-target="#askBlog"  ng-click="deleteCommentBlog(\'' + data + '\')">' +
                '</button>';
        }

        $scope.deleteCommentBlog = function(data) {
            var commentId = data;
            $scope.askDeleteCommentBlog = function() {
                var data = {};
                data.type = "Blogs";
                $http({
                    method: "POST",
                    url: '../api/comment/delete/' + commentId,
                    withCredentials: true,
                    data: data
                }).then(function successCallback(response) {
                    $scope.dtInstanceBlog.reloadData();
                }, function errorCallback(response) {});
            }
        }

    }
]);
