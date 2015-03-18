app.directive('ngMonthPicker', function(moment, datepicker) {
    return {
        restrict: 'AE',
        templateUrl: './directives/datepicker/monthpicker.html',
        scope: true,
        link: function(scope, iElement, iAttrs, ctrl) {
            scope.months = [];
            var now = moment().startOf('year');
            for (var i = 0; i < 12; i++) {
                scope.months.push({
                    short: now.format('MMM').split('.')[0],
                    long: now.format('MMMM')
                });
                now.add(1, 'months');
            }

            scope.$watch(function() {
                return datepicker.year;
            }, function(newValue, oldValue) {
                datepicker.month = ''; //reset month after year change
            });

            scope.selectMonth = function(month) {
                if (month.long == datepicker.month) {
                    datepicker.month = '';
                } else {
                    datepicker.month = month.long;
                }
            };
            scope.getMonthCSS = function(month) {
                return datepicker.month == month.long ? 'active' : '';
            };
        }
    };
});