app.controller("YieldController", function($rootScope, $scope, datepicker, moment) {
    $rootScope.pageTitle = "Opwekking";
    this.vm = this;
    this.datepicker = datepicker;


    $scope.$watchCollection(function() {
        return datepicker;
    }, function(newValue) {
        var date = datepicker.getDate();
        var formatYear = datepicker.year ? 'YYYY' : '';
        var formatMonth = datepicker.month ? 'MMMM ' : '';
        var formatDay = datepicker.day ? 'DD ' : '';

        $scope.title = date.format(formatDay + formatMonth + formatYear);
        if (newValue) {
            processDate(newValue);
        }
    });

    var processDate = function(datepicker) {
        //Checks which date has been selected: day, month or year
        if (datepicker.day) {
            $scope.graphDate = {
                date: datepicker.getDate().startOf('day').format('X'),
                type: 'day'
            };
        } else if (datepicker.month) {
            $scope.graphDate = {
                date: datepicker.getDate().startOf('month').format('X'),
                type: 'month'
            };
        } else if (datepicker.day) {
            $scope.graphDate = {
                date: datepicker.getDate().startOf('year').format('X'),
                type: 'year'
            };
        }
    };
});