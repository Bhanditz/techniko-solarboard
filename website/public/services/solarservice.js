app.factory('solars', function($http, $location, $interval, $cacheFactory) {
    //Remove cache after every 5 minutes
    $interval(function() {
        var cache = $cacheFactory.get('$http');
        cache.remove('/solar');
    }, 1000 * 60 * 5);

    return {
        all: $http({
            method: 'GET',
            url: '/solar',
            cache: true
        }),
        solar: function(solar) {
            return $http({
                method: 'GET',
                url: '/solar/' + solar,
                cache: true
            });
        }

    };
});