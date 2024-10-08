"use strict";
app.controller('newFestivalCtrl', ['$scope', '$http', '$state', '$timeout', 'Upload', 'Notification', 'ConfigService', 'ngProgressFactory',
    function($scope, $http, $state, $timeout, Upload, Notification, ConfigService, ngProgressFactory) {
        $scope.flag = true;
        var host = ConfigService.host;
        $scope.progressbar = ngProgressFactory.createInstance();
        $scope.progressbar.start();

        $scope.isShowAddEvent = true;
        $scope.events = [];

        $timeout(function() {
            $("#datetimepicker1").datetimepicker({
                format: 'LT'
            })
            $("#datetimepicker2").datetimepicker({
                format: 'LT'
            })

            $("#datetimepicker3").datetimepicker({
                format: 'DD/MM/YYYY'
            });
            $("#datetimepicker4").datetimepicker({
                format: 'DD/MM/YYYY'
            });
        }, 100)
        $http.get(host + '/province/lists').then(function success(response) {
            $timeout($scope.progressbar.complete(), 1000);
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
                        festivalInfo.thumbnailFull = image.imgName;
                        festivalInfo.thumbnailResize = image.imgResize;
                        festivalInfo.isPublic = true;
                        festivalInfo.event = $scope.events;
                        console.log(festivalInfo);
                        $http({
                            method: "POST",
                            url: host + '/festival/create',
                            data: festivalInfo
                        }).then(function successCallback(response) {
                            $timeout($scope.progressbar.complete(), 1000);
                            Notification('Tạo lễ hội thành công');
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
                Notification({ message: 'Vui lòng điền đầy đủ thông tin' }, 'warning');
            }
        };

        $scope.addEvent = function() {
            $scope.saveEvent = function() {
                $scope.flag = false;
                var inputDateBegin = $('#datebeginEvent').val();
                var inputDateEnd = $('#dateendEvent').val();
                var inputTimeBegin = $('#timebeginEvent').val();
                var inputTimeEnd = $('#timeendEvent').val();
                if ($scope.nameEvent != undefined && $scope.nameEvent != '' && timebeginEvent != '' && timeendEvent != '') {

                    $scope.events.push({
                        'name': $scope.nameEvent,
                        'dateBegin': inputDateBegin,
                        'dateEnd': inputDateEnd,
                        'timeBegin': inputTimeBegin,
                        'timeEnd': inputTimeEnd
                    });
                    $timeout($scope.progressbar.complete(), 1000);
                } else {
                    Notification({ message: 'Vui lòng điền đầy đủ thông tin' }, 'warning');
                }
            }
        }

        $scope.askDeleteEvent = function(index) {
            $scope.events.splice(index, 1);
            $timeout($scope.progressbar.complete(), 1000);
        }
    }
]);
