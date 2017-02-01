(function () {
    'use strict';

        var env = {};

    // Import variables if present (from env.js)
        if(window){  
          Object.assign(env, window.__env);
        }

    angular
        .module('app', ['ngRoute', 'ngCookies','ngGrid','ngSanitize', 'ngTouch', 'ui.grid', 'ui.grid.autoResize', 'ui.grid.selection', 'ui.grid.exporter', 'ui.grid.edit','ui.grid.resizeColumns','ui.bootstrap', 'schemaForm','angularjs-dropdown-multiselect','gm.datepickerMultiSelect','demo-calendar','ui.router','ui.calendar','ui.select2','ds.clock','chart.js','nvd3','ui.grid.autoResize',
    'ui.grid.resizeColumns','ui.knob','ngFileUpload','customFlip','ui.filters','ngCsv'])
        .config(config)
        .run(run)
        .directive('loading', loading)
        .directive('setClassWhenAtTop', setClassWhenAtTop)
        .constant('__env', env);






        loading.$inject = ['$http'];
        function loading($http) {
            return {
                restrict: 'A',
                link: function (scope, elm, attrs)
                {
                    scope.isLoading = function () {
                        return $http.pendingRequests.length > 0;
                    };

                    scope.$watch(scope.isLoading, function (v)
                    {
                        if(v){
                            elm.show();
                        }else{
                            elm.hide();
                        }
                    });
                }
            };
        }


        setClassWhenAtTop.$inject = ['$window'];
        function setClassWhenAtTop($window) {
            var $win = angular.element($window); // wrap window object as jQuery object

              return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                  var topClass = attrs.setClassWhenAtTop, // get CSS class from directive's attribute value
                      offsetTop = element.offset().top; // get element's offset top relative to document

                  $win.on('scroll', function (e) {
                    if ($win.scrollTop() >= offsetTop) {
                      element.addClass(topClass);
                    } else {
                      element.removeClass(topClass);
                    }
                  });
                }
              };
        }


    config.$inject = ['$urlRouterProvider', '$locationProvider', '$stateProvider'];
    
    function config($urlRouterProvider, $locationProvider,$stateProvider) {
       $stateProvider
            .state('login', {
            url: "/login",
            templateUrl: 'login/login.view.html',
            controller: 'LoginController',
            controllerAs: 'vm'

            })
            // .state('home', {
            //         url: "/home",
            //         controller: 'HomeController',
            //         templateUrl: 'home/home.view.html',
            //         controllerAs: 'vm'
            //     })
            .state('calendar', {
                    url: "/calendar",
                    controller: 'HomeController',
                    templateUrl: 'home/home.view.html',
                    controllerAs: 'vm'
                })

            .state('home', {
                url: "/home",
                templateUrl : 'reports/reports.html',
                controller  : 'ReportsController',
                controllerAs: 'vm',
                // onEnter: ["$state", function($state) {
                //   $(document).on("click", ".btn-danger", function() {
                //     $state.go("home");
                //   });

                  
                // }],
            })
            .state('home.view', {
                url: '/view/:id',
                views:{
                      "modal": {
                        templateUrl: "reports/reports.view.html",
                        controller  : 'ReportsController',
                        controllerAs: 'vm',
                        // onEnter: ["$state", function($state) {
                        //   $(document).on("click", ".btn-danger", function() {
                        //     $state.go("home");
                        //   });

                          
                        // }],
                      }
                    },
                    
                // controller  : 'AccountController',
                })

            // .state('register', {
            //     url: "/register",
            //     controller: 'RegisterController',
            //     templateUrl: 'register/register.view.html',
            //     controllerAs: 'vm'
            // })
            
            .state('timesheet', {
                    url: "/timesheet",
                    controller: 'TimeSheetController',
                    templateUrl: 'timesheet/timesheet.html',
                    controllerAs: 'vm'
                })

            // route for the account page
            .state('account', {
                url: "/account",
                templateUrl : 'accounts/account.html',
                controller  : 'AccountController',
				controllerAs: 'vm',
                onEnter: ["$state", function($state) {
      $(document).on("click", ".btn-danger", function() {
        $state.go("account");
      });
    }],
            })
    //.state('parent', {url: '/act', abstract: true, template: '<ui-view/>'} )
            .state('account.add', {
                url: '/add',
                views:{
                      "modal": {
                        templateUrl: "accounts/account.add.html"
                      }
                    },
                controller  : 'AccountController',
                controllerAs: 'vm'
                })
            .state('account.edit', {
                url: '/edit/:id',
                views:{
                      "modal": {
                        templateUrl: "accounts/account.add.html",
                        controller  : 'AccountEditController',
                        controllerAs: 'vm'

                      }
                    },
                    
                // controller  : 'AccountController',
                })
            .state('account.delete', {
                url: '/delete/:id',
                views:{
                      "modal": {
                        templateUrl: "accounts/account.delete.html",
                        controller  : 'AccountDeleteController',
                        controllerAs: 'vm'

                      }
                    },
                    
                // controller  : 'AccountController',
                })
            
            

            // route for the contact page
            .state('resources', {
                url: "/resources",
                templateUrl : 'resources/resources.html',
                controller  : 'ResourcesController',
                controllerAs: 'vm',
                onEnter: ["$state", function($state) {
      $(document).on("click", ".btn-danger", function() {
        $state.go("resources");
      });

      
    }],
            })
            .state('resources.add', {
                url: '/add',
                views:{
                      "modal": {
                        templateUrl: "resources/resources.add.html",
                        controller  : 'ResourcesController',
                        controllerAs: 'vm'

                      }
                    },
                
                })
            .state('resources.edit', {
                url: '/edit/:id',
                views:{
                      "modal": {
                        templateUrl: "resources/resources.add.html",
                        controller  : 'ResourcesEditController',
                        controllerAs: 'vm'

                      }
                    },
                    
                // controller  : 'AccountController',
                })
            .state('resources.delete', {
                url: '/delete/:id',
                views:{
                      "modal": {
                        templateUrl: "resources/resource.delete.html",
                        controller  : 'ResourcesDeleteController',
                        controllerAs: 'vm'

                      }
                    },
                    
                // controller  : 'AccountController',
                })
            
            .state('project', {
                url: "/mapping",
                templateUrl : 'project/project.html',
                controller  : 'ProjectController',
                controllerAs: 'vm',
                onEnter: ["$state", function($state) {
      $(document).on("click", ".btn-danger", function() {
        $state.go("project");
      });
      }],
            })
            .state('project.calendar', {
                url: '/calendar',
                views:{
                      "modal": {
                        templateUrl: "project/project.calendar.html",
                        controller  : 'ProjectController',
                        controllerAs: 'vm'

                      }
                    },
                    
                // controller  : 'AccountController',
                })
            .state('units', {
                url: "/units",
                templateUrl : 'ounit/unit.html',
                controller  : 'UnitController',
                controllerAs: 'vm',
                onEnter: ["$state", function($state) {
                  $(document).on("click", ".btn-danger", function() {
                    $state.go("units");
                  });

                  
                }],
            })
            .state('units.add', {
                url: '/add',
                views:{
                      "modal": {
                        templateUrl: "ounit/unit.add.html",
                        controller  : 'UnitController',
                        controllerAs: 'vm'

                      }
                    },
                
                })
            .state('units.edit', {
                url: '/edit/:id',
                views:{
                      "modal": {
                        templateUrl: "ounit/unit.add.html",
                        controller  : 'UnitEditController',
                        controllerAs: 'vm'

                      }
                    },
                    
                // controller  : 'AccountController',
                })
            .state('units.delete', {
                url: '/delete/:id',
                views:{
                      "modal": {
                        templateUrl: "ounit/unit.delete.html",
                        controller  : 'UnitDeleteController',
                        controllerAs: 'vm'

                      }
                    },
                })
            .state('roles', {
                url: "/roles",
                templateUrl : 'heirarchy/heirarchy.html',
                controller  : 'HeirarchyController',
                controllerAs: 'vm',
                onEnter: ["$state", function($state) {
                  $(document).on("click", ".btn-danger", function() {
                    $state.go("roles");
                  });

                  
                }],
            })
            .state('roles.add', {
                url: '/add',
                views:{
                      "modal": {
                        templateUrl: "heirarchy/roles.add.html",
                        controller  : 'HeirarchyController',
                        controllerAs: 'vm'

                      }
                    },
                
                })
            .state('roles.edit', {
                url: '/edit/:id',
                views:{
                      "modal": {
                        templateUrl: "heirarchy/roles.add.html",
                        controller  : 'HeirarchyEditController',
                        controllerAs: 'vm'

                      }
                    },
                })
            .state('roles.delete', {
                url: '/delete/:id',
                views:{
                      "modal": {
                        templateUrl: "heirarchy/roles.delete.html",
                        controller  : 'HeirarchyDeleteController',
                        controllerAs: 'vm'

                      }
                    },
                })
            .state('skill', {
                url: "/skill",
                templateUrl : 'skills/skills.html',
                controller  : 'SkillController',
                controllerAs: 'vm',
                onEnter: ["$state", function($state) {
                  $(document).on("click", ".btn-danger", function() {
                    $state.go("skill");
                  });

                  
                }],
            })
            .state('skill.add', {
                url: '/add',
                views:{
                      "modal": {
                        templateUrl: "skills/skills.add.html",
                        controller  : 'SkillController',
                        controllerAs: 'vm'

                      }
                    },
                
                })
            .state('skill.edit', {
                url: '/edit/:id',
                views:{
                      "modal": {
                        templateUrl: "skills/skills.add.html",
                        controller  : 'SkillEditController',
                        controllerAs: 'vm'

                      }
                    },
                    
                // controller  : 'AccountController',
                })
            .state('skill.delete', {
                url: '/delete/:id',
                views:{
                      "modal": {
                        templateUrl: "skills/skills.delete.html",
                        controller  : 'SkillDeleteController',
                        controllerAs: 'vm'

                      }
                    },
                })
            .state('services', {
                url: "/services",
                templateUrl : 'services/services.html',
                controller  : 'ServicesController',
                controllerAs: 'vm',
                onEnter: ["$state", function($state) {
                  $(document).on("click", ".btn-danger", function() {
                    $state.go("services");
                  });

                  
                }],
            })
            .state('services.add', {
                url: '/add',
                views:{
                      "modal": {
                        templateUrl: "services/services.add.html",
                        controller  : 'ServicesController',
                        controllerAs: 'vm'

                      }
                    },
                })
            .state('services.edit', {
                url: '/edit/:id',
                views:{
                      "modal": {
                        templateUrl: "services/services.add.html",
                        controller  : 'ServicesEditController',
                        controllerAs: 'vm'

                      }
                    },
                })
            .state('services.delete', {
                url: '/delete/:id',
                views:{
                      "modal": {
                        templateUrl: "services/services.delete.html",
                        controller  : 'ServicesDeleteController',
                        controllerAs: 'vm'

                      }
                    },
                })
            .state('serviceproject', {
                url: "/project",
                templateUrl : 'serviceproject/service-project.html',
                controller  : 'ServiceProjectController',
                controllerAs: 'vm',
                onEnter: ["$state", function($state) {
                  $(document).on("click", ".btn-danger", function() {
                    $state.go("serviceproject");
                  });
                  }],
                        })
            .state('serviceproject.add', {
                url: '/add',
                views:{
                      "modal": {
                        templateUrl: "serviceproject/service-project.add.html",
                        controller  : 'ServiceProjectController',
                        controllerAs: 'vm'

                      }
                    },
                })
            .state('serviceproject.edit', {
                url: '/edit/:id',
                views:{
                      "modal": {
                        templateUrl: "serviceproject/service-project.add.html",
                        controller  : 'ServiceProjectEditController',
                        controllerAs: 'vm'

                      }
                    },
                })
            .state('serviceproject.delete', {
                url: '/delete/:id',
                views:{
                      "modal": {
                        templateUrl: "serviceproject/service-project.delete.html",
                        controller  : 'ServiceProjectDeleteController',
                        controllerAs: 'vm'

                      }
                    },
                })
            .state('profile', {
                url: '/profile',
                templateUrl: "profile/profile.view.html",
                controller  : 'ProfileController',
                controllerAs: 'vm'

                });
            // .state('reports', {
            //     url: "/reports",
            //     templateUrl : 'reports/reports.html',
            //     controller  : 'ReportsController',
            //     controllerAs: 'vm',
            //     // onEnter: ["$state", function($state) {
            //     //   $(document).on("click", ".btn-danger", function() {
            //     //     $state.go("reports");
            //     //   });

                  
            //     // }],
            // }); 
            $urlRouterProvider.otherwise('/login');


           
    }
	

    run.$inject = ['$filter','$rootScope', '$location', '$cookieStore', '$http'];
    function run($filter,$rootScope, $location, $cookieStore, $http) {
        $rootScope.rootAccess =  $cookieStore.get("rootAccess");
        $rootScope.pmAccess =  $cookieStore.get("pmAccess");
        $rootScope.getClass = function (path) {
              return ($location.path().substr(0, path.length) === path) ? 'active' : '';
            }
            $rootScope.getDate = function () {
              return $filter('date')(new Date(), 'yyyy-MM-dd-hh-mm-ss');
            }
            $rootScope.imagereload = function (eid) {
              return 'img/'+eid+'.png?'+ new Date().getTime();
            }
        // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
        }

        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in and trying to access a restricted page
            var restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;
            var loggedIn = $rootScope.globals.currentUser;
            if (restrictedPage && !loggedIn) {
                $location.path('/login');
            }
            if (loggedIn) {
                var resPage = $.inArray($location.path(), ['/login', '/register','/timesheet','/profile']) === -1;
                if(!($rootScope.rootAccess || $rootScope.pmAccess)){
                    if(resPage ){
                        // if(resPage && (!$rootScope.rootAccess || !$rootScope.pmAccess)){
                    $location.path('/timesheet');
                    }
                }                
            }
                
        });
    }

})();