app.controller("YieldController", function($rootScope, $scope, datepicker, moment) {
    $rootScope.pageTitle = "Opwekking";
    this.vm = this;
    this.datepicker = datepicker;

    $scope.$watch(function() {
        return datepicker.day;
    }, function(newValue) {
        $scope.title = datepicker.day + " " + datepicker.month + " " + datepicker.year;
        if (newValue) {
            $scope.graphDate = moment(datepicker.year + " " + datepicker.month + " " + datepicker.day, "YYYY MMMM DD").format('X');
            console.log($scope.graphDate);
        }
    });
});