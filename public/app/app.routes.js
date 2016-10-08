'use strict';
app.config(function($stateProvider, $urlRouterProvider, $transitionsProvider, $locationProvider) {

    $transitionsProvider.onStart({
        to: function(state) {
            return state.requireAuthen === undefined ? true : false;
        }
    }, function($transition$, $state, userService) {
        if (userService.isLogin()) {
        } else {
            return $state.go('login');
        }

    });

    $urlRouterProvider.otherwise('/login');

    $stateProvider
        .state('login', {
            url: '/login',
            views: {
                'login': {
                    templateUrl: '/app/components/logins/login.html',
                    controller: 'loginCtrl'
                }
            },
            requireAuthen: false
        })
        .state('forgotpassword', {
            url: '/forgotpassword',
            views: {
                'login@': {
                    templateUrl: '/app/components/logins/forgotpassword.html',
                    controller: 'forgotpasswordCtrl'
                }
            },
            requireAuthen: false
        })
        .state('home', {
            url: '/',
            views: {
                'header@': {
                    templateUrl: '/app/shared/header.html',
                    controller: 'HeaderController'
                },
                'leftmenu@': {
                    templateUrl: '/app/shared/leftmenu.html',
                    controller: 'leftMenuController'
                },
                'content@': {
                    templateUrl: '/app/components/homes/home.html',
                    controller: 'homeCtrl'
                },
                'footer@': {
                    templateUrl: '/app/shared/footer.html',
                    controller: 'FooterController'
                },
                'aside@': {
                    templateUrl: '/app/shared/aside.html',
                    controller: 'AsideController'
                },
                'control-sidebar@': {
                    templateUrl: '/app/shared/control-sidebar.html',
                    controller: 'Control-sidebarController'
                }
            }
        })

    .state('home.index', {
            url: 'home',
            views: {
                'content@': {
                    templateUrl: '/app/components/homes/home.html',
                    controller: 'homeCtrl'
                }
            }
        })
        .state('home.profile', {
            url: 'profile/:userId',
            views: {
                'content@': {
                    templateUrl: '/app/components/profile/profile.html',
                    controller: 'profileCtrl'
                }
            }
        })
        .state('home.profile.changepassword', {
            url: '/change-password',
            views: {
                'content@': {
                    templateUrl: '/app/components/profile/changepassword.html',
                    controller: 'profileCtrl'
                }
            }
        })
        .state('home.user', {
            url: 'user',
            views: {
                'content@': {
                    templateUrl: '/app/components/users/user.html',
                    controller: 'userCtrl'
                }
            }
        })
        .state('home.user.new', {
            url: '/new',
            views: {
                'content@': {
                    templateUrl: '/app/components/users/usernew.html',
                    controller: 'userNewCtrl'
                }
            }
        })
        .state('home.user.edit', {
            url: '/edit/:userId',
            views: {
                'content@': {
                    templateUrl: '/app/components/users/useredit.html',
                    controller: 'userEditCtrl'
                }
            }
        })
        .state('home.festival', {
            url: 'festival',
            views: {
                'content@': {
                    templateUrl: '/app/components/festivals/festival.html',
                    controller: 'festivalCtrl'
                }
            }
        })
        .state('home.festival.new', {
            url: '/new',
            views: {
                'content@': {
                    templateUrl: '/app/components/festivals/newfestival.html',
                    controller: 'newFestivalCtrl'
                }
            }
        })
        .state('home.festival.edit', {
            url: '/edit/:festivalId',
            views: {
                'content@': {
                    templateUrl: '/app/components/festivals/editFestival.html',
                    controller: 'editFestivalCtrl'
                }
            }
        })
        .state('home.festival.detail', {
            url: '/:festivalId',
            views: {
                'content@': {
                    templateUrl: '/app/components/festivals/detailFestival.html',
                    controller: 'detailFestivalCtrl'
                }
            }
        })
        .state('home.blog', {
            url: 'blog',
            views: {
                'content@': {
                    templateUrl: '/app/components/blogs/blog.html',
                    controller: 'blogCtrl'
                }
            }
        })
        .state('home.comment', {
            url: 'comment',
            views: {
                'content@': {
                    templateUrl: '/app/components/comments/comment.html',
                    controller: 'commentCtrl'
                }
            }
        })
        .state('home.gallery', {
            url: 'gallery',
            views: {
                'content@': {
                    templateUrl: '/app/components/gallerys/gallery.html',
                    controller: 'galleryCtrl'
                }
            }
        })
        .state('home.statictis', {
            url: 'statictis',
            views: {
                'content@': {
                    templateUrl: '/app/components/statictis/statictis.html',
                    controller: 'statictisCtrl'
                }
            }
        })
        .state('home.config', {
            url: 'config',
            views: {
                'content@': {
                    templateUrl: '/app/components/configs/config.html',
                    controller: 'configCtrl'
                }
            }
        })
});

app.controller('leftMenuController', ['$scope','$window', function($scope,$window) {
    $scope.loggedUser = angular.fromJson($window.localStorage.loggedUser);
}])

app.controller('HeaderController', function($scope,$window) {
    $scope.loggedUser = angular.fromJson($window.localStorage.loggedUser);
});

app.controller('ContentController', function($scope) {

});

app.controller('FooterController', function($scope) {

});

app.controller('AsideController', ['$scope', function($scope) {

}])

app.controller('Control-sidebarController', ['$scope', function($scope) {

}])
