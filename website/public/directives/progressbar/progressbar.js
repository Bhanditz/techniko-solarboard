app.directive('ngProgress', function() {
    return {
        restrict: 'AE',
        templateUrl: './directives/progressbar/progressbar.html',
        scope: {
            progress: "@",
            color: "@",
            barheight: "@"
        },
        link: function(scope, element, attr, ctrl) {
            var color = scope.color ? scope.color : '#31c662';
            var barheight = scope.barheight ? scope.barheight : "1";
            console.log(scope);
            $(element).find('#progress-full').css({
                'background-color': color,
                'height': barheight + 'px',
                'position': 'absolute'
            });

            $(element).find('#progress-empty').css({
                'background-color': '#dcdcdc',
                'height': barheight + 'px',
                'position': 'absolute'
            });

            scope.$watch('progress', function(newValue) {
                setWidth(newValue / 100);
            });

            scope.$watch('color', function(newValue) {
                setColor(newValue);
            });

            function setWidth(progress) {
                var width = element[0].offsetWidth;
                $(element).find('#progress-full').animate({
                    'width': width * progress + 'px'
                }, {
                    duration: 500,
                    queue: false
                });

                $(element).find('#progress-empty').animate({
                    'left': width * progress,
                    'width': width * (1 - progress) + 'px'
                }, {
                    duration: 500,
                    queue: false
                });
            }

            function setColor(color) {
                $(element).find('#progress-full').css('background-color', color);
            }

            //Set start position!
            $(element).find('#progress-empty').css('left', 0).css('width', element[0].offsetWidth);
        }
    };
});