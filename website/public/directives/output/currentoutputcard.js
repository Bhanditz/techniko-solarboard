app.directive('ngOutput', function($interval, outputs) {
    return {
        restrict: 'AE',
        templateUrl: './directives/output/outputtemplate.html',
        scope: true,
        link: function(scope, iElement, iAttrs, ctrl) {
            var getTotalOutput = function(data) {
                var total = 0;
                if (data) {
                    for (var solar in data) {
                        var output = data[solar].output;
                        if (output) total += parseInt(output);
                    }
                }
                return total;
            };

            outputs.all.success(function(data, error) {
                scope.output = getTotalOutput(data);
            });
        }
    };
});