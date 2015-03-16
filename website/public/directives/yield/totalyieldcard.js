app.directive('ngTotalYield', function ($interval, solars) {
    return {
        restrict: 'AE',
        templateUrl: './directives/yield/totalyieldtemplate.html',
        scope: true,
        link: function (scope, iElement, iAttrs, ctrl) {
            var getTotalYield = function (data) {
                var total = 0;
                if (data) {
                    data.forEach(function (solar) {
                        var output = solar.totalYield;
                        if (output) total += output;
                    });
                }
                return total / 1000;
            };

            solars.success(function (data) {
                scope.yield = getTotalYield(data);
            });
        }
    };
});