app.directive('ngWeather', function ($interval, moment, weather) {
    return {
        restrict: 'AE',
        templateUrl: './directives/templates/weathertemplate.html',
        scope: true,
        link: function (scope, element, iAttrs, ctrl) {
            var timeId;

            element.on('$destroy', function () {
                $interval.cancel(timeId);
            });

            timeId = $interval(function () {
                scope.time = moment().format('HH:mm');
            }, 1000, 0, true);

            weather.current().success(function (data, status, headers, config) {
                scope.temperature = Math.round(data.main.temp * 10) / 10;
                scope.description = data.weather[0].description;
                scope.sundown = moment.unix(data.sys.sunset).format('HH:mm');
                scope.sunup = moment.unix(data.sys.sunrise).format('HH:mm');

                switch (data.weather[0].icon) {
                case '01d':
                    scope.weatherIcon = "mdi mdi-weather-sunny";
                    break;
                case '01n':
                    scope.weatherIcon = "mdi mdi-weather-night";
                    break;
                case '02d':
                case '02n':
                    scope.weatherIcon = "mdi mdi-partlycloudy";
                    break;
                case '03d':
                case '03n':
                    scope.weatherIcon = "mdi mdi-weather-cloudy";
                    break;
                case '04d':
                case '04n':
                    scope.weatherIcon = "mdi mdi-weather-cloudy";
                    break;
                case '09d':
                case '09n':
                    scope.weatherIcon = "mdi mdi-weather-rainy";
                    break;
                case '10d':
                case '10n':
                    scope.weatherIcon = "mdi mdi-weather-rainy";
                    break;
                case '11d':
                case '11n':
                    scope.weatherIcon = "mdi mdi-weather-lighting";
                    break;
                case '13d':
                case '13n':
                    scope.weatherIcon = "mdi mdi-weather-snowy";
                    break;
                case '50d':
                case '50n':
                    scope.weatherIcon = "mdi mdi-cloud";
                    break;
                default:
                    scope.weatherIcon = "mdi mdi-help";
                    break;
                }

            });
        }
    };
});
