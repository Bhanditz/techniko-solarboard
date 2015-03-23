app.factory('generated', function($http, $q, $location, moment) {
    var url = 'http://' + $location.host() + ':1337';

    function getDay(day, force) {
        var date;
        if (!day) {
            var now = new Date();
            //divide by 1000 to get seconds
            date = Math.floor(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 1000);
        } else {
            date = day;
        }

        //Check if the day was saved in monthcache
        if (!force && monthCache.length !== 0) {
            var monthDay = moment.utc(date, 'X');
            var month = $.grep(monthCache, function(e) {
                console.log(monthDay.startOf('month').format('X'));
                return e.month == monthDay.startOf('month').format('X');
            });

            if (month.length !== 0) {
                var targetDay = moment.utc(date, 'X').startOf('day');
                return $q(function(resolve, reject) {
                    resolve({
                        data: $.grep(month[0].data, function(e) {
                            return moment.utc(e.date).isSame(targetDay);
                        })
                    });
                });
            }
        }

        return $http.get(url + '/solar/generated/date=' + date, {
            cache: true
        });
    }

    //When a month is loaded the (~30) days are loaded with it, there is no reason to ask the server for a specific day
    //again if the client has it already loaded. This cache will keep the months.
    var monthCache = [];

    /**
     * Gets every day of given month (in UNIX)
     * @param  given month in UTC unix format
     * @param  if this is true only date + output of every day will be sent, saves bandwidth
     */
    function getMonth(month, totalOnly) {
        var date = month ? moment.utc(month, 'X') : moment.utc();
        date.startOf('month');

        var totalOnlyQuery = '';
        if (totalOnly) {
            totalOnlyQuery = '/true';
        }

        var promise = $http.get(url + '/solar/generated/date_start=' + date.format('X') +
            "&date_end=" + date.add(1, 'months').format('X') + totalOnlyQuery, {
                cache: true
            });

        if (!totalOnly) {
            promise.success(function(data, status, headers, config) {
                monthCache.push({
                    month: date.subtract(1, 'months').format('X'), //subtract a month because in the promise a month was added
                    data: data
                });
            });
        }

        return promise;
    }

    function getYear(year) {
        var date = year ? moment.utc(year, 'X') : moment.utc();
        date.startOf('year');

        return $http.get(url + '/solar/generated/year/' + date.format('X'), {
            cache: true
        });
    }

    return {
        getDay: getDay,
        getMonth: getMonth,
        getYear: getYear
    };
});