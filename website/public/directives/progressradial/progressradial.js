app.directive('ngProgressRadial', function() {
    return {
        restrict: 'AE',
        templateUrl: 'directives/progressradial/progressradial.html',
        scope: {
            progress: "@",
            sort: "@",
            color: "@",
            size: "@",
            radius: "@",
            offset: "@",
            background: "@",
            strokebg: "@",
            strokewidth: "@",
            description: "@"
        },
        link: function(scope, element, attr, ctrl) {
            var circle = $(element).find("#circle circle")[0];

            scope.offset = scope.offset ? scope.offset : 0;
            scope.strokewidth = scope.strokewidth ? scope.strokewidth : 1;
            scope.size = scope.size ? scope.size : 150;
            scope.color = scope.color ? scope.color : "white";
            scope.radius = scope.size / 2 - scope.strokewidth;
            scope.dash = 2 * Math.PI * scope.radius;
            scope.progress = scope.progress ? scope.progress : 0;
            scope.sort = scope.sort ? scope.sort : "";
        }
    };
});