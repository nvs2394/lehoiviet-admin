"use strict";
app.controller('editFestivalCtrl', ['$scope', '$http', '$state', '$timeout', 'Notification', 'Upload',

    function($scope, $http, $state, $timeout, Notification, Upload) {
        var festivalId = $state.params.festivalId;

        $http.get('/api/province/lists').then(function success(response) {
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
            if (data.thumbnail != undefined) {
                $scope.thumbnail = data.thumbnail.imgResize;
                $scope.thumbnailId = data.thumbnail._id;
            } else {
                $scope.thumbnail = "/images/no-image.png";
            }
            $scope.district = data.address.district;
            var timebegin = new Date(data.timeBegin);
            var timeend = new Date(data.timeEnd);
            $scope.timebegin = timebegin.toLocaleString();
            $scope.timeend = timeend.toLocaleString();
            $("#datetimepicker1").datetimepicker();
            $("#datetimepicker2").datetimepicker();
        }, function errorCallback(response) {

        });
        $scope.updateFestival = function(thumbnail) {
            var content = {};
            var inputTimeBegin = $('#timebegin').val();
            var inputTimeEnd = $('#timeend').val();
            var timebegin = new Date(inputTimeBegin);
            var timeend = new Date(inputTimeEnd);
            content.title = $scope.title;
            content.description = $scope.description;
            content.content = $scope.content;
            content.website = $scope.website;
            content.emailAddress = $scope.emailAddress;
            content.phoneNumber = $scope.phoneNumber;
            content.typeEvent = $scope.typeEvent;
            content.mainAddress = $scope.mainAddress;
            content.city = $scope.city;
            content.district = $scope.district;
            content.priceTicket = $scope.priceTicket;
            content.timeBegin = timebegin.toISOString();
            content.timeEnd = timeend.toISOString();
            content.isPublic = true;
            if (typeof(thumbnail) != 'string') {
                thumbnail.upload = Upload.upload({
                    url: '../api/images/thumbnail/festival/' + festivalId,
                    data: { file: thumbnail },
                });

                thumbnail.upload.then(function(response) {
                    content.thumbnail = response.data.data._id;
                    updateData(festivalId, content);
                    Notification({ message: 'Edit festival successfully', title: 'Success' });
                    $timeout(function() {
                        $state.go('home.festival');
                    }, 200);
                }, function(response) {
                    if (response.status > 0)
                        $scope.errMessage = true;
                }, function(evt) {});
            } else {
                content.thumbnail = $scope.thumbnailId;
                updateData(festivalId, content);
                Notification({ message: 'Edit festival successfully', title: 'Success' });
                $timeout(function() {
                    $state.go('home.festival');
                }, 200);
            }
        }

        function updateData(festivalId, data) {
            $http({
                method: "PUT",
                url: "../api/festival/update/" + festivalId,
                data: data
            }).then(function successCallback(response) {
                return true;
            }, function errorCallback(response) {});
        }
    }
]);
