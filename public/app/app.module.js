'use strict';
var app = angular.module('LehoivietAdmin', ['ui.router', 'datatables', 'chart.js',
    'ngCookies', 'ngFileUpload', 'ui-notification', 'validation.match','ngProgress'
]);


app.factory('ConfigService', [function() {
    return {
        host: 'https://api.lehoiviet.vn',
        // host: 'http://api.lehoiviet.vn',
        // hostImage: 'http://api.lehoiviet.vn'
        hostImage:'https://api.lehoiviet.vn'

    };
}]);


app.config(['ChartJsProvider', function(ChartJsProvider) {
    // Configure all charts
    ChartJsProvider.setOptions({
        colours: ['#FF5252', '#FF8A80'],
        responsive: false
    });
    // Configure all line charts
    ChartJsProvider.setOptions('Line', {
        datasetFill: false
    });
}])

String.prototype.trunc = String.prototype.trunc || function(n) {
    return this.length > n ? this.substr(0, n - 1) + '...' : this.toString();
};

app.config(function($httpProvider) {
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
});

app.directive('fullHeight', function($window) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var offsetHeight = attrs.offset | 0;
            element.css('min-height', ($window.innerHeight - offsetHeight) + 'px');
            // handle resize, fix footer position. Now only support fixed mode
            angular.element($window).bind('resize', function(e) {
                element.css('min-height', (e.target.innerHeight - offsetHeight) + 'px');
            })
        }
    }
})

app.config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push(function($q, $state, $window) {
        if ($window.localStorage.token != undefined) {
            $httpProvider.defaults.headers.common['Authorization'] = $window.localStorage.token;
        }
        return {
            'response': function(response) {
                //Will only be called for HTTP up to 300
                return response;
            },
            'responseError': function(rejection) {
                if (rejection.status === 403) {
                    $state.go('login');
                }
                return $q.reject(rejection);
            }
        };
    });
}]);
