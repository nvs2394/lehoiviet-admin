"use strict";
app.controller('statictisCtrl', ['$scope', '$http', 'ConfigService', function($scope, $http, ConfigService) {
    var host = ConfigService.host;
    $scope.chartFestival = function() {
        $http.get(host + '/festival/count/bydate').then(function success(response) {
            var data = [];
            var labels = [];
            for (var i = 0; i < response.data.data.length; i++) {
                labels.push(response.data.data[i]._id.date.year + '/' + response.data.data[i]._id.date.month + '/' + response.data.data[i]._id.date.day);
                data.push(response.data.data[i].count);
            }
            $scope.labels = labels;
            $scope.series = ['Posted'];
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
            $scope.seriesUser = ['User Created'];
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
            $scope.seriesComment = ['Comment Created'];
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
            $scope.seriesBlog = ['Blog Created'];
            $scope.dataBlog = [data];
            $scope.onClick = function(points, evt) {
                //console.log(points, evt);
            };
        });
    }

}]);
