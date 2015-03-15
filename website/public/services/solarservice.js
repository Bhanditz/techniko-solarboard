app.factory('solars', function($http) {
    return $http({
        method: 'GET',
        url: 'http://127.0.0.1:1337/solar',
        cache: true
    });
});