"use strict";
app.controller('editFestivalCtrl', ['$scope', '$http', '$state', '$timeout', 'Notification', 'Upload', 'ConfigService', 'ngProgressFactory',
    function($scope, $http, $state, $timeout, Notification, Upload, ConfigService, ngProgressFactory) {
        $scope.progressbar = ngProgressFactory.createInstance();
        $scope.progressbar.start();

        var host = ConfigService.host;
        var hostImage = ConfigService.hostImage;
        var festivalId = $state.params.festivalId;
        $scope.thumbnailResize = '';
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
             $("#datetimepicker5").datetimepicker({
                format: 'LT'
            })
            $("#datetimepicker6").datetimepicker({
                format: 'LT'
            })

            $("#datetimepicker7").datetimepicker({
                format: 'DD/MM/YYYY'
            });
            $("#datetimepicker8").datetimepicker({
                format: 'DD/MM/YYYY'
            });
        }, 100)
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
            $scope.city = data.address.cityCode;
            $scope.content = data.content;
            $scope.typeEvent = data.typeEvent._id.toString();
            $scope.time = data.timeBegin;
            $scope.mainAddress = data.address.mainAddress;
            $scope.thumbnail = hostImage + data.thumbnail.full;
            $scope.thumbnailResize = data.thumbnail.resize;
            $scope.district = data.address.district;
            $http.get(host + '/event/list/' + data._id).then(function successCallback(response) {
                $scope.events = response.data.data;
                $scope.progressbar.complete();
            })
        }, function errorCallback(response) {

        });

        $scope.updateFestival = function(thumbnail) {
            var content = {};
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
            if (typeof(thumbnail) != 'string') {
                thumbnail.upload = Upload.upload({
                    url: host + '/image/upload/thumbnail/festival',
                    data: { file: thumbnail },
                });

                thumbnail.upload.then(function(response) {
                    content.thumbnailFull = response.data.data.imgName;
                    content.thumbnailResize = response.data.data.imgResize;
                    updateData(festivalId, content);
                }, function(response) {
                    if (response.status > 0)
                        $scope.errMessage = true;
                }, function(evt) {});
            } else {
                content.thumbnailFull = $scope.thumbnail.split(hostImage)[1];
                content.thumbnailResize = $scope.thumbnailResize;
                updateData(festivalId, content);
            }
        }

        function updateData(festivalId, data) {
            $http({
                method: "PUT",
                url: host + "/festival/updatebyadmin/" + festivalId,
                data: data
            }).then(function successCallback(response) {
                if (response.data.data.code == 0) {
                    Notification({ message: 'Vui lòng điền đầy đủ thông tin' }, 'warning');
                } else if (response.data.data.code == 1) {
                    Notification('Chỉnh sửa lễ hội thành công');
                    $timeout(function() {
                        $state.go('home.festival');
                    }, 200);

                    $scope.progressbar.complete();

                } else if (response.data.data.code == 2) {
                    Notification({ message: 'Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc' }, 'warning');
                }
            });
        }

        $scope.editEvent = function(id) {
            $http.get(host + '/event/show/' + id).then(function successCallback(response) {
                var event = response.data.data;
                $scope.nameEvent = event.name;
                $scope.datebeginEvent = event.dateBegin.toLocaleString();
                $scope.dateendEvent = event.dateEnd.toLocaleString();
                $scope.timebeginEvent = event.timeBegin;
                $scope.timeendEvent = event.timeEnd;
                $("#datetimepicker3").datetimepicker();
                $("#datetimepicker4").datetimepicker();
                $("#datetimepicker1").datetimepicker();
                $("#datetimepicker2").datetimepicker();
            });
            $scope.updateEvent = function() {
                if ($scope.nameEvent != undefined && $scope.nameEvent != '') {
                    var inputDateBegin = $('#datebeginEvent').val();
                    var inputDateEnd = $('#dateendEvent').val();
                    var inputTimeBegin = $('#timebeginEvent').val();
                    var inputTimeEnd = $('#timeendEvent').val();
                    if (inputDateBegin < inputDateEnd) {
                        var event = {};
                        event.name = $scope.nameEvent;
                        event.dateBegin = inputDateBegin;
                        event.dateEnd = inputDateEnd;
                        event.timeBegin = inputTimeBegin;
                        event.timeEnd = inputTimeEnd;
                        $http({
                            method: "POST",
                            url: host + "/event/update/" + id,
                            data: event
                        }).then(function successCallback(response) {
                            Notification({ message: 'Chỉnh sửa sự kiện thành công' }, 'Success');
                            $http.get(host + '/event/list/' + festivalId).then(function successCallback(response) {
                                $scope.events = response.data.data;
                                $scope.progressbar.complete();
                            })
                        }, function errorCallback(response) {});
                    } else {
                        Notification({ message: 'Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc' }, 'warning');
                    }
                } else {
                    Notification({ message: 'Vui lòng điền đầy đủ thông tin' }, 'warning');
                }
            }
        }

        $scope.askDeleteEvent = function(id) {
            $scope.deleteEvent = function() {
                $http({
                    method: "POST",
                    url: host + "/event/delete/" + id,
                    data: event
                }).then(function successCallback(response) {
                    $http.get(host + '/event/list/' + festivalId).then(function successCallback(response) {
                        $scope.events = response.data.data;
                        $scope.progressbar.complete();
                        Notification({ message: 'Đã xóa sự kiện' }, 'Success');
                    })
                }, function errorCallback(response) {});
            }
        }

        $scope.addEvent = function() {
            var inputDateBegin = $('#newDatebeginEvent').val();
            var inputDateEnd = $('#newDateendEvent').val();
            var inputTimeBegin = $('#newTimebeginEvent').val();
            var inputTimeEnd = $('#newTimeendEvent').val();
            if (inputDateBegin < inputDateEnd) {
                if ($scope.newNameEvent != undefined && $scope.newNameEvent != '' &&
                    inputTimeBegin != '' && inputTimeEnd != '') {
                    var event = {};
                    event.name = $scope.newNameEvent;
                    event.dateBegin = inputDateBegin;
                    event.dateEnd = inputDateEnd;
                    event.timeBegin= inputTimeBegin;
                    event.timeEnd = inputTimeEnd;
                    $http({
                        method: "POST",
                        url: host + "/event/create/" + festivalId,
                        data: event
                    }).then(function successCallback(response) {
                        $http.get(host + '/event/list/' + festivalId).then(function successCallback(response) {
                            $scope.events = response.data.data;
                        })
                        $scope.progressbar.complete();
                        Notification({ message: 'Thêm sự kiện thành công' }, 'Success');
                    }, function errorCallback(response) {});
                } else {
                    Notification({ message: 'Vui lòng điền đầy đủ thông tin' }, 'warning');
                }

            } else {
                Notification({ message: 'Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc' }, 'warning');
            }

        }
    }
]);
