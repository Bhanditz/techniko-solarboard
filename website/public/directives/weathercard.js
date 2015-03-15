app.directive('ngWeather', function(weather) {
    return {
        restrict: 'AE',
        templateUrl: './directives/templates/weathertemplate.html',
        scope: true,
        link: function() {

        }
    };
});
