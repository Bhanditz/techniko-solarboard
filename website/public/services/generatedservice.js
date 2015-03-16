app.factory('generated', function ($http) {

    var getDay = function (day) {
        var date;
        if (!day) {
            var now = new Date();
            //divide by 1000 to get seconds
            date = Math.floor(new Date(now.getFullYear(), now.getMonth(), now.getDate()) / 1000);
        } else {
            date = day;
        }
        return $http.get('http://82.74.62.72:1337/solar/generated/date=' + date, {
            cache: true
        });
    };

    return {
        getDay: getDay
    };
});