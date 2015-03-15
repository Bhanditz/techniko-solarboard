app.factory('weather', function($http) {
    var city = '2759632';
    var apikey = '267194dcaef308f0ecd76989b9a78877';
    var url = "http://api.openweathermap.org/data/2.5/weather?id=" + city + "&APPID=" + apikey + "&units=metric";

    return {
        today: $http({
            method: 'GET',
            url: url,
            cache: true
        })
    };
});