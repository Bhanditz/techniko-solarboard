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
        processDate(newValue);
        setButtonTitle(newValue);
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
        } else if (datepicker.year) {
            $scope.graphDate = {
                date: datepicker.getDate().startOf('year').format('X'),
                type: 'year'
            };
        }
    };

    var setButtonTitle = function(date) {
        if (date.day) {
            $scope.buttonVisible = true;
            $scope.buttonTitle = 'Maandoverzicht';
        } else if (date.month) {
            $scope.buttonVisible = true;
            $scope.buttonTitle = 'Jaaroverzicht';
        } else if (date.year) {
            $scope.buttonVisible = false;
        }
    };

    this.processButtonClick = function() {
        if (datepicker.day) {
            datepicker.day = '';
        } else if (datepicker.month) {
            datepicker.month = '';
        }
    };
});