app.factory('outputs', function($http, $location) {
    function getOutput(solar) {
        return $http({
            method: 'GET',
            url: '/solar/output/' + solar
        });
    }

    function getAllOutput() {
        return $http({
            method: 'GET',
            url: '/solar/output'
        });
    }

    return {
        solar: getOutput,
        all: getAllOutput
    };
});