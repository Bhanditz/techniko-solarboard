var app = angular.module("solarboard", ["ui.router", "ngAnimate", "highcharts-ng", "angularMoment"]);

app.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/");

    $stateProvider
        .state('dashboard', {
            resolve: {
                solars: function ($http) {
                    return $http({
                        method: 'GET',
                        url: 'http://127.0.0.1:1337/solar'
                    });
                },

                generated: "generated"
            },
            url: '/',
            templateUrl: '/partials/dashboard.html',
            controller: 'DashboardController as dash'
        })
});