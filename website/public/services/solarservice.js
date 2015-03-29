app.factory('solars', function($http, $location) {
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