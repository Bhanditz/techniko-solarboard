app.factory('weather', function($http) {
    var city = '2759632';
    var apikey = '267194dcaef308f0ecd76989b9a78877';

    var current = function() {
        return $http({
            method: 'GET',
            url: 'http://82.74.62.72:1337/weather'
        });
    };

    var today = function() {
        var now = new Date();
        var start = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
        var end = now.getTime();
        var url = "http://api.openweathermap.org/data/2.5/history/city?id=" + city + "&type=hour&start=" + Math.floor(start / 1000) + "&cnt=" + 4 + "&APPID=" + apikey + "&callback=JSON_CALLBACK";
        console.log(url);
        return $http.jsonp(url, {
            params: {

            },
            cache: true
        });
    };


    return {
        current: current,
        today: today
    };
});