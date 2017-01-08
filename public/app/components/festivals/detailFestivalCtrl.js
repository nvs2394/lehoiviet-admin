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
                var datebegin = event.dateBegin;
                var dateend = event.dateEnd;
                $scope.datebeginEvent = datebegin;
                $scope.dateendEvent = dateend;
                $scope.timebeginEvent = event.timeBegin;
                $scope.timeendEvent = event.timeEnd;

                $("#datetimepicker2").datetimepicker({
                    format: 'LT'
                })
                $("#datetimepicker4").datetimepicker({
                    format: 'LT'
                })

                $("#datetimepicker1").datetimepicker({
                    format: 'DD/MM/YYYY'
                });
                $("#datetimepicker3").datetimepicker({
                    format: 'DD/MM/YYYY'
                });
            });
        }
    }
]);
