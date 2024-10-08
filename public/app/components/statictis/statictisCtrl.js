"use strict";
app.controller('statictisCtrl', ['$scope', '$http', 'ConfigService', 'ngProgressFactory', function($scope, $http, ConfigService, ngProgressFactory) {
    var host = ConfigService.host;
    $scope.progressbar = ngProgressFactory.createInstance();
    $scope.progressbar.start();
    $scope.chartFestival = function() {
        $http.get(host + '/festival/count/bydate').then(function success(response) {
            $scope.progressbar.complete();
            var data = [];
            var labels = [];
            for (var i = 0; i < response.data.data.length; i++) {
                labels.push(response.data.data[i]._id.date.year + '/' + response.data.data[i]._id.date.month + '/' + response.data.data[i]._id.date.day);
                data.push(response.data.data[i].count);
            }
            $scope.labels = labels;
            $scope.series = ['Lễ hội'];
            $scope.data = [data];
            $scope.onClick = function(points, evt) {
                //console.log(points, evt);
            };
        });
    }

    $scope.chartUser = function() {
        $http.get(host + '/user/bydate').then(function success(response) {
            var data = [];
            var labels = [];
            for (var i = 0; i < response.data.data.length; i++) {
                labels.push(response.data.data[i]._id.date.year + '/' + response.data.data[i]._id.date.month + '/' + response.data.data[i]._id.date.day);
                data.push(response.data.data[i].count);
            }
            $scope.labelsUser = labels;
            $scope.seriesUser = ['Người dùng'];
            $scope.dataUser = [data];
            $scope.onClick = function(points, evt) {
                //console.log(points, evt);
            };
        });
    }

    $scope.chartComment = function() {
        $http.get(host + '/comment/count/bydate').then(function success(response) {
            var data = [];
            var labels = [];
            for (var i = 0; i < response.data.data.length; i++) {
                labels.push(response.data.data[i]._id.date.year + '/' + response.data.data[i]._id.date.month + '/' + response.data.data[i]._id.date.day);
                data.push(response.data.data[i].count);
            }
            $scope.labelsComment = labels;
            $scope.seriesComment = ['Bình luận'];
            $scope.dataComment = [data];
            $scope.onClick = function(points, evt) {
                //console.log(points, evt);
            };
        });
    }

    $scope.chartBlog = function() {
        $http.get(host + '/blog/count/bydate').then(function success(response) {
            var data = [];
            var labels = [];
            for (var i = 0; i < response.data.data.length; i++) {
                labels.push(response.data.data[i]._id.date.year + '/' + response.data.data[i]._id.date.month + '/' + response.data.data[i]._id.date.day);
                data.push(response.data.data[i].count);
            }
            $scope.labelsBlog = labels;
            $scope.seriesBlog = ['Blog'];
            $scope.dataBlog = [data];
            $scope.onClick = function(points, evt) {
                //console.log(points, evt);
            };
        });
    }

}]);
