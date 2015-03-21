app.factory('datepicker', function(moment) {
    var year = '';
    var month = '';
    var day = '';

    var getDate = function() {
        var date = moment.utc().startOf('year');
        if (this.year) date.year(this.year);
        if (this.month) date.month(this.month);
        if (this.day) date.date(this.day);

        return date;
    };

    /**
     * Set year, month and day from this date
     * @param date in unix
     */
    var setDate = function(date, type) {
        var momentDate = moment(date, 'X');
        if (!type || type == 'day') {
            this.year = momentDate.year();
            this.month = momentDate.month();
            this.day = momentDate.date();
        } else if (type == 'month') {
            this.year = momentDate.year();
            this.month = momentDate.month();
        } else if (type == 'year') {
            this.year = momentDate.year();
        }
    };

    return {
        year: year,
        month: month,
        day: day,
        getDate: getDate,
        setDate: setDate
    };
});