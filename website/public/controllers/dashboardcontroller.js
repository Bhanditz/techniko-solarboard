app.controller('DashboardController', function($rootScope, $scope, $http, moment, solars) {
    var vm = this;
    this.connectionError = false;

    $rootScope.pageTitle = "Overzicht";

    var now = new Date();

    this.outputData = solars.data;

    this.getFromNow = function(date) {
        return moment(date).fromNow();
    };
});