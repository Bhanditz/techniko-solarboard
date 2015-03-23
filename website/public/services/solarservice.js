app.factory('solars', function($http, $location) {
    return $http({
        method: 'GET',
        url: 'http://' + $location.host() + ':1337' + '/solar',
        cache: true
    });
});