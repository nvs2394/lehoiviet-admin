"use strict";
app.controller('newFestivalCtrl', ['$scope', '$http', '$state', '$timeout', 'Upload', 'Notification', 'ConfigService',
    function($scope, $http, $state, $timeout, Upload, Notification, ConfigService) {
        $scope.flag = true;
        var host = ConfigService.host;

        $scope.isShowAddEvent = true;
        $scope.events = [];

        $timeout(function() {
            $("#datetimepicker1").datetimepicker();
            $("#datetimepicker2").datetimepicker();
            $("#datetimepicker3").datetimepicker();
            $("#datetimepicker4").datetimepicker();
        }, 100)
        $http.get(host + '/province/lists').then(function success(response) {
            $scope.allProvinces = response.data.data;
        });

        $http.get(host + '/category/lists').then(function success(response) {
            $scope.allCategories = response.data.data;
        });

        $scope.createFestival = function(thumbnail) {
            if ($scope.title != undefined && $scope.description != undefined && $scope.content != undefined &&
                $scope.website != null && $scope.emailAddress != undefined && $scope.phoneNumber != undefined &&
                $scope.typeEvent != undefined && $scope.mainAddress != undefined && $scope.city != undefined &&
                $scope.district != undefined && $scope.priceTicket != undefined
            ) {
                if (thumbnail != undefined) {
                    thumbnail.upload = Upload.upload({
                        url: host + '/image/upload/thumbnail/festival',
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
                        festivalInfo.content = $scope.content;
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
                        festivalInfo.event = $scope.events;
                        $http({
                            method: "POST",
                            url: host + '/festival/create',
                            data: festivalInfo
                        }).then(function successCallback(response) {
                            Notification({ message: 'Added new festival', title: 'Success' });
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
            } else {
                Notification({ message: 'Please fill out festival', title: 'Warning' }, 'warning');
            }
        };

        $scope.addEvent = function() {
            $scope.saveEvent = function() {
                $scope.flag = false;
                var inputTimeBegin = $('#timebeginEvent').val();
                var inputTimeEnd = $('#timeendEvent').val();
                if ($scope.nameEvent != undefined && $scope.descriptionEvent != undefined && timebeginEvent != '' && timeendEvent != '') {
                    $scope.events.push({
                        'name': $scope.nameEvent,
                        'description': $scope.descriptionEvent,
                        'timeBegin': inputTimeBegin,
                        'timeEnd': inputTimeEnd
                    });
                } else {
                    Notification({ message: 'Please fill out Event', title: 'Warning' }, 'warning');
                }
            }
        }
    }
]);
