var app = angular.module("solarboard", ["ngRoute", "ngAnimate", "highcharts-ng", "angularMoment"]);

app.config(['$routeProvider', '$locationProvider',
  function ($routeProvider, $locationProvider) {
        $routeProvider

            .when('/', {
                templateUrl: '/partials/dashboard.html',
                controller: 'DashboardController'
            })
            .when('/output', {
                templateUrl: '/partials/export.html'
            });

        $locationProvider.html5Mode(true);
}]);