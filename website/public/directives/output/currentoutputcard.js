app.directive('ngOutput', function($interval, outputs) {
    return {
        restrict: 'AE',
        templateUrl: './directives/output/currentoutputcard.html',
        scope: {
            output: "@"
        },
        link: function(scope, element, iAttrs, ctrl) {
            function getTotalOutput(data) {
                outputs.all().success(function(data) {
                    var total = 0;
                    if (data) {
                        for (var solar in data) {
                            var output = data[solar].output;
                            if (output) total += parseInt(output);
                        }
                    }
                    scope.output = total;
                });
            }

            getTotalOutput();
            var timer = $interval(function() {
                getTotalOutput();
            }, 3000);

            element.on('$destroy', function() {
                $interval.cancel(timer);
            });
        }
    };
});