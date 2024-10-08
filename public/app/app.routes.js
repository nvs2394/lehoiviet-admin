'use strict';
app.config(function($stateProvider, $urlRouterProvider, $transitionsProvider, $locationProvider) {

    $transitionsProvider.onStart({
        to: function(state) {
            return state.requireAuthen === undefined ? true : false;
        }
    }, function($transition$, $state, userService, $window, $location) {
        var roleID = angular.fromJson($window.localStorage.loggedUser).role;
        var url = $transition$.to().name;
        var listAccessForRole3 = ['home.approve-live', 'login', 'home.profile.changepassword',
         'forgotpassword', 'home.profile','home.festival.detail','resetpassword'];
        if (roleID === 3 && listAccessForRole3.indexOf(url) === -1) {
            return $state.go('login');
        }

    });

    $urlRouterProvider.otherwise('/login');

    $stateProvider
        .state('login', {
            url: '/login',
            views: {
                'login': {
                    templateUrl: 'public/app/components/logins/login.html',
                    controller: 'loginCtrl'
                }
            },
            requireAuthen: false
        })
        .state('forgotpassword', {
            url: '/forgotpassword',
            views: {
                'login@': {
                    templateUrl: 'public/app/components/logins/forgotpassword.html',
                    controller: 'forgotpasswordCtrl'
                }
            },
            requireAuthen: false
        })
        .state('resetpassword', {
            url: '/resetpassword/:token',
            views: {
                'login@': {
                    templateUrl: 'public/app/components/logins/resetpassword.html',
                    controller: 'forgotpasswordCtrl'
                }
            },
            requireAuthen: false
        })
        .state('home', {
            url: '/',
            views: {
                'header@': {
                    templateUrl: 'public/app/shared/header.html',
                    controller: 'HeaderController'
                },
                'leftmenu@': {
                    templateUrl: 'public/app/shared/leftmenu.html',
                    controller: 'leftMenuController'
                },
                'content@': {
                    templateUrl: 'public/app/components/homes/home.html',
                    controller: 'homeCtrl'
                },
                'footer@': {
                    templateUrl: 'public/app/shared/footer.html',
                    controller: 'FooterController'
                },
                'aside@': {
                    templateUrl: 'public/app/shared/aside.html',
                    controller: 'AsideController'
                },
                'control-sidebar@': {
                    templateUrl: 'public/app/shared/control-sidebar.html',
                    controller: 'Control-sidebarController'
                }
            }
        })

    .state('home.index', {
            url: 'home',
            views: {
                'content@': {
                    templateUrl: 'public/app/components/homes/home.html',
                    controller: 'homeCtrl'
                }
            }
        })
        .state('home.profile', {
            url: 'profile/:userId',
            views: {
                'content@': {
                    templateUrl: 'public/app/components/profile/profile.html',
                    controller: 'profileCtrl'
                }
            }
        })
        .state('home.profile.changepassword', {
            url: '/change-password',
            views: {
                'content@': {
                    templateUrl: 'public/app/components/profile/changepassword.html',
                    controller: 'profileCtrl'
                }
            }
        })
        .state('home.user', {
            url: 'user',
            views: {
                'content@': {
                    templateUrl: 'public/app/components/users/user.html',
                    controller: 'userCtrl'
                }
            }
        })
        .state('home.user.new', {
            url: '/new',
            views: {
                'content@': {
                    templateUrl: 'public/app/components/users/usernew.html',
                    controller: 'userNewCtrl'
                }
            }
        })
        .state('home.user.edit', {
            url: '/edit/:userId',
            views: {
                'content@': {
                    templateUrl: 'public/app/components/users/useredit.html',
                    controller: 'userEditCtrl'
                }
            }
        })
        .state('home.festival', {
            url: 'festival',
            views: {
                'content@': {
                    templateUrl: 'public/app/components/festivals/festival.html',
                    controller: 'festivalCtrl'
                }
            }
        })
        .state('home.festival.new', {
            url: '/new',
            views: {
                'content@': {
                    templateUrl: 'public/app/components/festivals/newfestival.html',
                    controller: 'newFestivalCtrl'
                }
            }
        })
        .state('home.festival.edit', {
            url: '/edit/:festivalId',
            views: {
                'content@': {
                    templateUrl: 'public/app/components/festivals/editFestival.html',
                    controller: 'editFestivalCtrl'
                }
            }
        })
        .state('home.festival.detail', {
            url: '/:festivalId',
            views: {
                'content@': {
                    templateUrl: 'public/app/components/festivals/detailFestival.html',
                    controller: 'detailFestivalCtrl'
                }
            }
        })
        .state('home.blog', {
            url: 'blog',
            views: {
                'content@': {
                    templateUrl: 'public/app/components/blogs/blog.html',
                    controller: 'blogCtrl'
                }
            }
        })
        .state('home.comment', {
            url: 'comment',
            views: {
                'content@': {
                    templateUrl: 'public/app/components/comments/comment.html',
                    controller: 'commentCtrl'
                }
            }
        })
        .state('home.gallery', {
            url: 'gallery',
            views: {
                'content@': {
                    templateUrl: 'public/app/components/gallerys/gallery.html',
                    controller: 'galleryCtrl'
                }
            }
        })
        .state('home.statictis', {
            url: 'statictis',
            views: {
                'content@': {
                    templateUrl: 'public/app/components/statictis/statictis.html',
                    controller: 'statictisCtrl'
                }
            }
        })
        .state('home.config', {
            url: 'config',
            views: {
                'content@': {
                    templateUrl: 'public/app/components/configs/config.html',
                    controller: 'configCtrl'
                }
            }
        })
        .state('home.approve-live', {
            url: 'approve-live',
            views: {
                'content@': {
                    templateUrl: 'public/app/components/lives/live.html',
                    controller: 'liveCtrl'
                }
            },
            permission: [3]
        })
});

app.controller('leftMenuController', ['$scope', '$window', function($scope, $window) {
    $scope.loggedUser = angular.fromJson($window.localStorage.loggedUser);
    $scope.roleID = $scope.loggedUser.role;
}])

app.controller('HeaderController', function($scope, $window, loginService, $state) {
    $scope.loggedUser = angular.fromJson($window.localStorage.loggedUser);
    $scope.logout = function() {
        loginService.logout();
    }
});

app.controller('ContentController', function($scope) {

});

app.controller('FooterController', function($scope) {

});

app.controller('AsideController', ['$scope', function($scope) {

}])

app.controller('Control-sidebarController', ['$scope', function($scope) {

}])
