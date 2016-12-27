'use strict';

app.service('userService', function($window) {
    this.isLogin = function() {
        return $window.localStorage.loggedUser == undefined ? false : true;
    };
    this.listAccessPage = function(){
        
    }
});

app.service('loginService', ['$http', '$window', '$state', '$q','ConfigService', function($http, $window, $state, $q,ConfigService) {
    this.login = function(objUser) {
        var host = ConfigService.host;
        var deferred = $q.defer();
        $http.post(host+'/user/login/admin', objUser)
            .then(function(res) {
                $window.localStorage.token = res.data.token;
                    $window.localStorage.user = res.data.user;
                    deferred.resolve(res.data);
            });
        return deferred.promise;
    };
    this.logout = function() {
        $window.localStorage.removeItem('token');
        $window.localStorage.removeItem('loggedUser');
    }
}]);
