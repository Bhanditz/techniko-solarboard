app.factory('weather', function($http, $location, $interval, $cacheFactory) {
    var city = '2759632';
    var apikey = '267194dcaef308f0ecd76989b9a78877';
    var url = 'http://' + $location.host() + ':1337' + '/weather';

    var current = function() {
        return $http({
            method: 'GET',
            url: url,
            cache: true
        });
    };

    //Remove cache after every 5 minutes
    $interval(function() {
        console.log("Removing weather cache");
        var cache = $cacheFactory.get('$http');
        cache.remove(url);
}, 1000 * 60 * 5);

    return {
        current: current
    };
});