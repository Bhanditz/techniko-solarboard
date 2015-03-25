var app = angular.module("solarboard", ["ui.router", "ngAnimate", "highcharts-ng", "angularMoment"]);

app.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/");

    $stateProvider
        .state('dashboard', {
            resolve: {
                solars: "solars",
                generated: "generated"
            },
            url: '/',
            templateUrl: '/partials/dashboard.html',
            controller: 'DashboardController as dash'
        })

    .state('yield', {
        url: '/yield',
        templateUrl: '/partials/yield.html',
        controller: 'YieldController as yield'
    })

    .state('solars', {
        url: '/solars/:solar',
        templateUrl: '/partials/solars.html',
        controller: 'SolarController as solar'
    });


});