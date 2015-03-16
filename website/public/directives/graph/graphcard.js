app.directive('ngGraph', function (moment) {
    return {
        restrict: 'AE',
        templateUrl: './directives/graph/graphtemplate.html',
        scope: {

        },
        link: function (scope, iElement, iAttrs, ctrl) {
            scope.currentYear = parseInt(moment().format('YYYY'));

            var baseYearCSS = {
                "position": 'absolute',
                "bottom": 0,
                "top": 0,
                "right": 0,
                "left": 0,
                "font-size": '44px'
            };
            var bgYearCSS = {
                "color": 'gray',
                "font-weight": 200,
                "z-index": 0
            };
            var invisYearCSS = {
                "opacity": 0,
                "font-weight": 200,
                "z-index": 0
            };
            var frontYearCSS = {
                "font-weight": 300
            };
            var animateCSS = {
                "transition": "transform 0.8s ease, color 0.8s ease, opacity 0.4s ease 0.3s"
            };

            var posYearCSS = [{
                    "transform": "translateX(-300px)"
                }, {
                    "transform": "translateX(-150px)"
                }, {}, {
                    "transform": "translateX(150px)"
                }, {
                    "transform": "translateX(300px)"
                }
            ];
            var yearCSS = [];
            yearCSS.push($.extend({}, baseYearCSS, invisYearCSS, posYearCSS[0], animateCSS)); //this year is invisible, used for infinite scrolling of years
            yearCSS.push($.extend({}, baseYearCSS, bgYearCSS, posYearCSS[1], animateCSS));
            yearCSS.push($.extend({}, baseYearCSS, frontYearCSS, posYearCSS[2], animateCSS));
            yearCSS.push($.extend({}, baseYearCSS, bgYearCSS, posYearCSS[3], animateCSS));
            yearCSS.push($.extend({}, baseYearCSS, invisYearCSS, posYearCSS[4], animateCSS)); //this year is invisible, used for infinite scrolling of years

            scope.years = [];
            for (var i = 0; i < 5; i++) {
                scope.years.push({
                    name: scope.currentYear - (i - 2),
                    css: yearCSS[i]
                });
            }

            scope.move = function (direction) {
                scope.currentYear += direction;
                var template = scope.years.slice();
                for (var i = 0; i < scope.years.length; i++) {
                    if (i + direction == scope.years.length) {
                        scope.years[i] = template[0];
                        scope.years[i].name = scope.currentYear - (i - 2);
                    } else if (i + direction < 0) {
                        scope.years[i] = template[scope.years.length - 1];
                        scope.years[i].name = scope.currentYear - (i - 2);
                    } else {
                        scope.years[i] = template[i + direction];
                    }
                }
            };
        }
    };
});