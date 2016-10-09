"use strict";
app.controller('editFestivalCtrl', ['$scope', '$http', '$state', '$timeout', 'Notification', 'Upload', 'ConfigService',
    function($scope, $http, $state, $timeout, Notification, Upload, ConfigService) {
        var host = ConfigService.host;
        var hostImage = ConfigService.hostImage;
        var festivalId = $state.params.festivalId;
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
            $scope.thumbnail = hostImage + data.thumbnail.resize;
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
            if (typeof(thumbnail) != 'string') {
                thumbnail.upload = Upload.upload({
                    url: host + '/image/thumbnail/festival/' + festivalId,
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
                content.thumbnail = $scope.thumbnail;
                updateData(festivalId, content);
            }
        }

        function updateData(festivalId, data) {
            $http({
                method: "PUT",
                url: host + "/festival/updatebyadmin/" + festivalId,
                data: data
            }).then(function successCallback(response) {
                Notification({ message: 'Edit festival successfully', title: 'Success' });
                $timeout(function() {
                    $state.go('home.festival');
                }, 200);
            }, function errorCallback(response) {});
        }

        $scope.editEvent = function(id) {
            $http.get(host + '/event/show/' + id).then(function successCallback(response) {
                var event = response.data.data;
                $scope.nameEvent = event.name;
                $scope.descriptionEvent = event.description;
                var timebegin = new Date(event.timeBegin);
                var timeend = new Date(event.timeEnd);
                $scope.timebeginEvent = timebegin.toLocaleString();
                $scope.timeendEvent = timeend.toLocaleString();
                $("#datetimepicker3").datetimepicker();
                $("#datetimepicker4").datetimepicker();
            });
            $scope.updateEvent = function() {
                var inputTimeBegin = $('#timebeginEvent').val();
                var inputTimeEnd = $('#timeendEvent').val();
                var event = {};
                event.name = $scope.nameEvent;
                event.description = $scope.descriptionEvent;
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
                    Notification({ message: 'Updated', title: 'Successfully' }, 'Success');
                }, function errorCallback(response) {});
            }
        }

        $scope.askDeleteEvent = function(id) {
            $scope.deleteEvent = function() {
                $http({
                    method: "POST",
                    url: host + "/event/delete/" + id,
                    data: event
                }).then(function successCallback(response) {
                    $http.get(host + '/event/list/' + response.data.data.festivalId).then(function successCallback(response) {
                        $scope.events = response.data.data;
                    })
                    Notification({ message: 'Deleted', title: 'Successfully' }, 'Success');
                }, function errorCallback(response) {});
            }
        }

        $scope.addEvent = function() {
            var inputTimeBegin = $('#timebeginEvent').val();
            var inputTimeEnd = $('#timeendEvent').val();
            if ($scope.newNameEvent != undefined && $scope.newDescriptionEvent != undefined && $scope.timebeginEvent != '' && $scope.timeendEvent != '') {
                var event = {};
                event.name = $scope.newNameEvent;
                event.description = $scope.newDescriptionEvent;
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
                    Notification({ message: 'Created', title: 'Successfully' }, 'Success');
                }, function errorCallback(response) {});
            } else {
                Notification({ message: 'Please fill out Event', title: 'Warning' }, 'warning');
            }
        }
    }
]);
