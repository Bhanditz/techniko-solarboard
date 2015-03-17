app.directive('ngYearPicker', function(moment) {
    return {
        restrict: 'AE',
        templateUrl: './directives/graph/yearpicker.html',
        scope: true,
        link: function(scope, iElement, iAttrs, ctrl) {
            scope.year = parseInt(moment().format('YYYY'));
            scope.animating = false;

            var baseYearCSS = {
                "position": 'absolute',
                "bottom": 0,
                "top": 0,
                "right": 0,
                "left": 0,
                "font-size": '44px',
                'transition': 'color ease 0.5s'
            };
            var bgYearCSS = {
                "color": 'gray',
                "font-weight": 200,
            };
            var frontYearCSS = {
                "color": 'black',
                "font-weight": 300
            };

            var setupYears = function() {
                scope.years = [];
                for (var i = 0; i < 5; i++) {
                    scope.years.push(scope.year + (-2 + i));

                }
                $('.year').each(function(id, element) {
                    if (id === 2) {
                        $(this).css(frontYearCSS);
                    } else {
                        $(this).css(bgYearCSS);
                    }

                    $(this).data('position', id);
                    $(this).css(baseYearCSS);
                    $(this).css('left', 300 * (-2 + id));
                });
            };
            setupYears();

            scope.move = function(direction) {
                if (!scope.animating) {
                    scope.animating = true;
                    scope.year -= direction;
                    var max = 4;

                    $('.year').each(function(id, element) {
                        var pos = $(this).data('position') + direction;
                        $(this).data('position', pos);

                        if (pos === 2) {
                            $(this).css(frontYearCSS);
                        } else {
                            $(this).css(bgYearCSS);
                        }

                        $(this).animate({
                            left: "+=" + (300 * direction)
                        }, 400, function() {
                            scope.animating = false;
                            var pos = $(this).data('position');
                            if (pos < 0) {
                                pos = max;
                                $(this).data('position', pos);
                                $(this).css('left', 300 * (-2 + pos));
                                scope.years[id] = scope.year + 2;
                            } else if (pos > max) {
                                pos = 0;
                                $(this).data('position', pos);
                                $(this).css('left', 300 * (-2 + pos));
                                scope.years[id] = scope.year - 2;
                            }
                        });
                    });
}
};
}
};
});