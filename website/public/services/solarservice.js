app.factory('solars', function ($http) {
    return $http({
        method: 'GET',
        url: 'http://82.74.62.72:1337/solar',
        cache: true
    });
});