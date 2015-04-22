app.factory('solars', function($http, $location, $interval, $cacheFactory) {
    var url = 'http://' + $location.host() + ':1337' + '/solar';

    //Remove cache after every 5 minutes
    $interval(function() {
        var cache = $cacheFactory.get('$http');
        cache.remove(url);
    }, 1000 * 60 * 5);

    return {
        all: $http({
            method: 'GET',
            url: 'http://' + $location.host() + ':1337' + '/solar',
            cache: true
        }),
        solar: function(solar) {
            return $http({
                method: 'GET',
                url: 'http://' + $location.host() + ':1337' + '/solar/' + solar,
                cache: true
            });
        }

    };
});