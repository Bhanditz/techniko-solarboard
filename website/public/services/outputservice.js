app.factory('outputs', function($http, $location) {
    function getOutput(solar) {
        return $http({
            method: 'GET',
            url: 'http://' + $location.host() + ':1337' + '/solar/output/' + solar
        });
    }

    return {
        solar: getOutput,
        all: $http({
            method: 'GET',
            url: 'http://' + $location.host() + ':1337' + '/solar/output'
        })
    };
});