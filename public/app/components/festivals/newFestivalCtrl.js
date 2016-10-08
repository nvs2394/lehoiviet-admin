"use strict";
app.controller('newFestivalCtrl', ['$scope', '$http', '$state', '$timeout', 'Upload', 'Notification', function($scope, $http, $state, $timeout, Upload, Notification) {

    $scope.isShowAddEvent = true;

    $timeout(function() {
        $("#datetimepicker1").datetimepicker();
        $("#datetimepicker2").datetimepicker();
        $("#datetimepicker3").datetimepicker();
        $("#datetimepicker4").datetimepicker();
    }, 100)
    $http.get('/api/province/lists').then(function success(response) {
        $scope.allProvinces = response.data.data;
    });

    $http.get('/api/category/lists').then(function success(response) {
        $scope.allCategories = response.data.data;
    });

    $scope.events = [];
    $scope.createFestival = function(thumbnail) {
        if (thumbnail != undefined) {
            thumbnail.upload = Upload.upload({
                url: '../api/image/upload/thumbnail/festival',
                data: { file: thumbnail },
            });

            thumbnail.upload.then(function(response) {
                var image = response.data.data;
                var festivalInfo = {};
                var inputTimeBegin = $('#timebegin').val();
                var inputTimeEnd = $('#timeend').val();
                var timebegin = new Date(inputTimeBegin);
                var timeend = new Date(inputTimeEnd);
                festivalInfo.title = $scope.title;
                festivalInfo.description = $scope.description;
                festivalInfo.festivalInfo
                festivalInfo.website = $scope.website;
                festivalInfo.emailAddress = $scope.emailAddress;
                festivalInfo.phoneNumber = $scope.phoneNumber;
                festivalInfo.typeEvent = $scope.typeEvent;
                festivalInfo.mainAddress = $scope.mainAddress;
                festivalInfo.city = $scope.city;
                festivalInfo.district = $scope.district;
                festivalInfo.priceTicket = $scope.priceTicket;
                festivalInfo.timeBegin = timebegin.toISOString();
                festivalInfo.timeEnd = timeend.toISOString();
                festivalInfo.thumbnailFull = image.imgName;
                festivalInfo.thumbnailResize = image.imgResize;
                festivalInfo.isPublic = true;
                $http({
                    method: "POST",
                    url: '../api/festival/create',
                    withCredentials: true,
                    data: festivalInfo
                }).then(function successCallback(response) {
                    Notification({ message: 'Add new festival', title: 'Success' });
                    $timeout(function() {
                        $state.go('home.festival');
                    }, 200);
                }, function(response) {
                    if (response.status > 0)
                        $scope.errMessage = true;
                }, function(evt) {});

            }, function errorCallback(response) {});
        } else {
            $scope.isShowErr = true;
        }
    };

    $scope.addEvent = function() {
        $scope.events.push({
            'name': $scope.nameEvent,
            'description': $scope.descriptionEvent,
            'timeBegin': $scope.timeBeginEvent,
            'timeEnd': $scope.timeEndEvent
        });
        console.log($scope.events)
    }
}]);
