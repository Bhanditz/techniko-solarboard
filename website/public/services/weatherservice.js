app.factory('weather', function($http, $location, $interval, $cacheFactory) {
    var city = '2759632';
    var apikey = '267194dcaef308f0ecd76989b9a78877';

    var current = function() {
        return $http({
            method: 'GET',
            url: '/weather',
            cache: true
        });
    };

    //Remove cache after every 10 minutes
    $interval(function() {
        var cache = $cacheFactory.get('$http');
        cache.remove('/weather');
    }, 1000 * 60 * 10);

    return {
        current: current
    };
});