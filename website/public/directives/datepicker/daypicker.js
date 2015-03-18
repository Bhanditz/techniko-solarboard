app.directive('ngDayPicker', function(moment, datepicker) {
    return {
        restrict: 'AE',
        templateUrl: './directives/datepicker/daypicker.html',
        scope: true,
        link: function(scope, iElement, iAttrs, ctrl) {
            scope.datepicker = datepicker;
            scope.weekdays = moment.weekdays();
            //Switch the first element with the last, otherwise week would begin with sunday
            var tempDay = scope.weekdays[0];
            scope.weekdays.splice(0, 1);
            scope.weekdays[6] = tempDay;

            scope.days = [];
            scope.$watch(function() {
                return datepicker.month;
            }, function(newValue, oldValue) {
                updateDays(datepicker.year, newValue);
            });


            var startWeekDay = 0;
            var maxMonthDay = 0;
            this.updateDays = function(year, month) {
                //Month may not be null
                if (month) {
                    datepicker.day = "";
                    scope.days = [];
                    var date = moment().year(year).month(month).add(1, 'months').date(0);
                    maxMonthDay = date.dates();
                    var goalDay = moment(date);

                    startWeekDay = date.startOf('month').weekday();
                    var datePos = date.subtract(startWeekDay, 'days');

                    var weekdays = [];
                    while (moment.max(datePos, goalDay) != datePos || weekdays.length !== 0) {
                        weekdays.push(datePos.dates());
                        if (weekdays.length == 7) {
                            scope.days.push(weekdays);
                            weekdays = [];
                        }
                        datePos.add(1, 'days');
                    }
                } else {
                    closeDay();
                }
            };

            scope.isInactiveDay = function(id) {
                return id < startWeekDay || id - startWeekDay >= maxMonthDay;
            };

            scope.selectDay = function(id, day) {
                if (!scope.isInactiveDay(id)) {
                    if (datepicker.day === day) {
                        datepicker.day = "";
                    } else {
                        datepicker.day = day;
                    }
                }
            };

            scope.isActiveDay = function(day) {
                return datepicker.day === day;
            };

            //Special function so the window can be scrolled up when called
            this.closeDay = function() {
                console.log("Closing");
                datepicker.day = "";

                $("html, body").animate({
                    'scrollTop': 0
                }, {
                    duration: 400,
                    queue: false
                });
            };
        }
    };
});