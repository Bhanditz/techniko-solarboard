app.factory('outputs', function($http, $location) {
    function getOutput(solar) {
        return $http({
            method: 'GET',
            url: 'http://' + $location.host() + ':1337' + '/solar/output/' + solar
        });
    }

    function getAllOutput() {
        return $http({
            method: 'GET',
            url: 'http://' + $location.host() + ':1337' + '/solar/output'
        });
    }

    return {
        solar: getOutput,
        all: getAllOutput
    };
});