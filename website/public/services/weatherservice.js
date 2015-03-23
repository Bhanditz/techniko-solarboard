app.factory('weather', function($http, $location) {
    var city = '2759632';
    var apikey = '267194dcaef308f0ecd76989b9a78877';

    var current = function() {
        return $http({
            method: 'GET',
            url: 'http://' + $location.host() + ':1337' + '/weather'
        });
    };


    return {
        current: current
    };
});