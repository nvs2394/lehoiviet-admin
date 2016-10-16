"use strict";
app.controller('detailFestivalCtrl', ['$scope', '$http', '$state', '$timeout', 'ConfigService', 'ngProgressFactory',

    function($scope, $http, $state, $timeout, ConfigService, ngProgressFactory) {
        $scope.progressbar = ngProgressFactory.createInstance();
        $scope.progressbar.start();
        var host = ConfigService.host;
        var hostImage = ConfigService.hostImage;

        var festivalId = $state.params.festivalId;

        $http.get(host + '/province/lists').then(function success(response) {
            $scope.allProvinces = response.data.data;
        });

        $http.get(host + '/category/lists').then(function success(response) {
            $scope.allCategories = response.data.data;
        });

        $http({
            method: "GET",
            url: host + '/festival/show/' + festivalId
        }).then(function successCallback(response) {
            var data = response.data.data;
            $scope.title = data.title;
            $scope.description = data.description;
            $scope.priceTicket = data.priceTicket;
            $scope.emailAddress = data.contactInfo.emailAddress;
            $scope.website = data.contactInfo.website;
            $scope.phoneNumber = data.contactInfo.phoneNumber;
            $scope.city = data.address.city;
            $scope.content = data.content;
            $scope.typeEvent = data.typeEvent._id.toString();
            $scope.time = data.timeBegin;
            $scope.mainAddress = data.address.mainAddress;
            $scope.thumbnail = hostImage + data.thumbnail.resize;
            $scope.district = data.address.district;
            var datecreated = new Date(data.createAt);
            $scope.datecreated = datecreated.toLocaleString();

            var timeBegin = new Date(data.timeBegin);
            $scope.timebegin = timeBegin.toLocaleString();
            var timeEnd = new Date(data.timeEnd);
            $scope.timeend = timeEnd.toLocaleString();
            $scope.progressbar.complete();
        }, function errorCallback(response) {

        });

        $http.get(host + '/event/list/' + festivalId).then(function successCallback(response) {
            $scope.events = response.data.data;
        })

        $scope.showEvent = function(eventId) {
            $http.get(host + '/event/show/' + eventId).then(function successCallback(response) {
                var event = response.data.data;
                $scope.nameEvent = event.name;
                var timebegin = new Date(event.timeBegin);
                var timeend = new Date(event.timeEnd);
                $scope.timebeginEvent = timebegin.toLocaleString();
                $scope.timeendEvent = timeend.toLocaleString();
                $("#datetimepicker3").datetimepicker();
                $("#datetimepicker4").datetimepicker();
            });
        }
    }
]);
