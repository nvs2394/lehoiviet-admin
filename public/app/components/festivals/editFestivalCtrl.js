"use strict";
app.controller('editFestivalCtrl', ['$scope', '$http', '$state', '$timeout', 'Notification', 'Upload', 'ConfigService',
    function($scope, $http, $state, $timeout, Notification, Upload, ConfigService) {
        var host = ConfigService.host;
        var hostImage = ConfigService.hostImage;
        var festivalId = $state.params.festivalId;
        $scope.thumbnailResize = '';
        $timeout(function() {
            $("#datetimepicker1").datetimepicker();
            $("#datetimepicker2").datetimepicker();
            $("#datetimepicker3").datetimepicker();
            $("#datetimepicker4").datetimepicker();
            $("#datetimepicker5").datetimepicker();
            $("#datetimepicker6").datetimepicker();
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
            $scope.city = data.address.city;
            $scope.content = data.content;
            $scope.typeEvent = data.typeEvent._id.toString();
            $scope.time = data.timeBegin;
            $scope.mainAddress = data.address.mainAddress;
            $scope.thumbnail = hostImage + data.thumbnail.full;
            $scope.thumbnailResize = data.thumbnail.resize;
            $scope.district = data.address.district;
            var timebegin = new Date(data.timeBegin);
            var timeend = new Date(data.timeEnd);
            $scope.timebegin = timebegin.toLocaleString();
            $scope.timeend = timeend.toLocaleString();
            $("#datetimepicker1").datetimepicker();
            $("#datetimepicker2").datetimepicker();
            $http.get(host + '/event/list/' + data._id).then(function successCallback(response) {
                $scope.events = response.data.data;
            })
        }, function errorCallback(response) {

        });

        $scope.updateFestival = function(thumbnail) {
            var content = {};
            var inputTimeBegin = $('#timebeginUpdate').val();
            var inputTimeEnd = $('#timeendUpdate').val();
            if (inputTimeBegin < inputTimeEnd) {
                if (true) {
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
                    content.timeBegin = inputTimeBegin;
                    content.timeEnd = inputTimeEnd;
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
                        content.thumbnailFull = $scope.thumbnail;
                        content.thumbnailResize = $scope.thumbnailResize;
                        updateData(festivalId, content);
                    }
                }
            } else {
                Notification({ message: 'Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc' }, 'warning');
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

                } else if (response.data.data.code == 2) {
                    Notification({ message: 'Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc' }, 'warning');
                }
            }, function errorCallback(response) {});
        }

        $scope.editEvent = function(id) {
            $http.get(host + '/event/show/' + id).then(function successCallback(response) {
                var event = response.data.data;
                $scope.nameEvent = event.name;
                var timebegin = new Date(event.timeBegin);
                var timeend = new Date(event.timeEnd);
                $scope.timebeginEvent = timebegin.toLocaleString();
                $scope.timeendEvent = timeend.toLocaleString();
                $("#datetimepicker3").datetimepicker();
                $("#datetimepicker4").datetimepicker();
            });
            $scope.updateEvent = function() {
                if ($scope.nameEvent!=undefined &&$scope.nameEvent!='') {
                    var inputTimeBegin = $('#timebeginEvent').val();
                    var inputTimeEnd = $('#timeendEvent').val();
                    if (inputTimeBegin < inputTimeEnd) {
                        var event = {};
                        event.name = $scope.nameEvent;
                        event.timeBegin = inputTimeBegin;
                        event.timeEnd = inputTimeEnd;
                        $http({
                            method: "POST",
                            url: host + "/event/update/" + id,
                            data: event
                        }).then(function successCallback(response) {
                            $http.get(host + '/event/list/' + response.data.data.festivalId).then(function successCallback(response) {
                                $scope.events = response.data.data;
                            })
                            Notification({ message: 'Chỉnh sửa sự kiện thành công' }, 'Success');
                        }, function errorCallback(response) {});
                    } else {
                        Notification({ message: 'Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc' }, 'warning');
                    }
                }else{
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
                        Notification({ message: 'Đã xóa sự kiện' }, 'Success');
                    })
                }, function errorCallback(response) {});
            }
        }

        $scope.addEvent = function() {
            var inputTimeBegin = $('#newTimebeginEvent').val();
            var inputTimeEnd = $('#newTimeendEvent').val();
            if (inputTimeBegin < inputTimeEnd) {
                if ($scope.newNameEvent != undefined && $scope.newNameEvent != '' &&
                    inputTimeBegin != '' && inputTimeEnd != '') {
                    var event = {};
                    event.name = $scope.newNameEvent;
                    event.timeBegin = inputTimeBegin;
                    event.timeEnd = inputTimeEnd;
                    $http({
                        method: "POST",
                        url: host + "/event/create/" + festivalId,
                        data: event
                    }).then(function successCallback(response) {
                        $http.get(host + '/event/list/' + response.data.data.festivalId).then(function successCallback(response) {
                            $scope.events = response.data.data;
                        })
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
