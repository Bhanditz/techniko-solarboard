app.directive('ngOutput', function($interval, solars) {
    return {
        restrict: 'AE',
        templateUrl: './directives/templates/outputtemplate.html',
        scope: true,
        link: function(scope, iElement, iAttrs, ctrl) {
            var getTotalOutput = function(data) {
                var total = 0;
                if (data) {
                    data.forEach(function(solar) {
                        var output = solar.output;
                        if (output) total += output;
                    });
                }
                return total;
            };

            solars.success(function(data, error) {
                scope.output = getTotalOutput(data);
            });
        }
    };
});