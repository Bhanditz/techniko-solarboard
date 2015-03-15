app.controller('DashboardController', function ($rootScope, $http, moment, solars) {
    var vm = this;
    this.connectionError = false;

    $rootScope.pageTitle = "Overzicht";

    this.outputData = solars.data;

    this.getFromNow = function (date) {
        return moment(date).fromNow();
    };
});