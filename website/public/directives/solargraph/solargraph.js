app.directive('ngSolarGraph', function(generated, moment, $timeout) {
    return {
        restrict: 'AE',
        templateUrl: 'directives/solargraph/solargraph.html',
        scope: {
            solar: "@"
        },
        link: function(scope, element, attr, ctrl) {
            var s = Snap(element[0].children[0]);
            //Small hack to wait for the DOM to load
            $timeout(function() {
                updateGraph();
            }, 0);

            $(window).resize(function() {
                updateGraph();
            });

            function updateGraph() {
                scope.height = element[0].offsetHeight;
                scope.width = element[0].offsetWidth;
                var padding = 60;
                var graphHeight = scope.height - padding;
                var graphWidth = scope.width - padding;

                s.attr({
                    width: scope.width,
                    height: scope.height
                });

                s.clear();
                generated.getDay(null, scope.solar).success(function(data) {
                    if (data) {
                        var current = moment();
                        current.subtract(1, 'hours');
                        current.minute(current.minutes() - current.minutes() % 5); //Set to round minutes
                        var outputInfo = [];
                        for (var i = 0; i < 12; i++) {
                            current.add(5, 'minutes');
                            var output = data[current.hours()][current.minutes() / 5];
                            output = output ? output : 0;
                            outputInfo.push(output);
                        }
                        var max = getMax(outputInfo);
                        var scaleY;
                        if (max === 0)
                            scaleY = graphHeight;
                        else
                            scaleY = (0.9 / max) * graphHeight;

                        var graph = s.path("");
                        var x = padding;
                        var y = graphHeight - outputInfo[0] * scaleY;
                        createCircle(x, y, "#14819c");
                        var d = "M" + x + " " + y + "R ";
                        for (var n = 1; n < outputInfo.length; n++) {
                            x += (graphWidth) / outputInfo.length;
                            y = graphHeight - (outputInfo[n] * scaleY);
                            d += x + "," + y + " ";

                            createCircle(x, y, "#14819c");
                            if (outputInfo[n] === max && max !== 0) {
                                var xp = (x > graphWidth - 10) ? x - 90 : x + 15;
                                var text = (Math.round(max * 3600 / 300 * 100) / 100) + " watt";
                                var b = s.rect(xp - 5, y - 25, text.length * 8, 30);
                                var f = s.filter(Snap.filter.shadow(0, 2, 3));
                                b.attr({
                                    fill: 'white',
                                    opacity: 0.8,
                                    filter: f
                                });


                                var t = s.text(xp, y, text);
                                t.attr('fill', '#14819c');
                                t.attr({
                                    'font-weight': 300
                                });
                            }
                        }


                        graph.attr('path', d);
                        graph.attr({
                            stroke: "white",
                            strokeWidth: "4",
                            fill: "none",
                            strokeLinecap: "round"
                        });
                    }
                });
            }

            function getMax(data) {
                var max = 0;
                data.forEach(function(number) {
                    max = Math.max(max, number);
                });
                return max;
            }

            function createCircle(x, y, color) {
                var circle = s.circle(x, y, 5);
                circle.attr({
                    fill: color,
                    stroke: "white",
                    strokeWidth: "2"
                });
                circle.hover(function() {
                    circle.animate({
                        r: 8
                    }, 300, mina.easein);
                }, function() {
                    circle.animate({
                        r: 5
                    }, 300, mina.easein);
                });
            }
        }
    };
});