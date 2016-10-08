"use strict";
app.controller('detailFestivalCtrl', ['$scope', '$http', '$state', '$timeout',

    function($scope, $http, $state, $timeout) {


        var festivalId = $state.params.festivalId;

        $http.get('/api/provinces/getAllProvinces').then(function success(response) {
            $scope.allProvinces = response.data.data;
        });

        $http.get('/api/categories/getCategories').then(function success(response) {
            $scope.allCategories = response.data.data;
        });

        $http({
            method: "GET",
            url: '/api/festival/show/' + festivalId
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
            $scope.typeEvent = data.typeEvent._id;
            $scope.time = data.timeBegin;
            $scope.mainAddress = data.address.mainAddress;
            $scope.thumbnail = data.thumbnail.imgResize;
            $scope.district = data.address.district;
            var datecreated = new Date(data.createAt);
            $scope.datecreated = datecreated.toLocaleString();

            var timeBegin = new Date(data.timeBegin);
            $scope.timebegin = timeBegin.toLocaleString();
            var timeEnd = new Date(data.timeEnd);
            $scope.timeend = timeEnd.toLocaleString();
        }, function errorCallback(response) {

        });
    }
]);
