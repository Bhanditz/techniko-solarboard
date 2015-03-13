app.factory('generated', function ($http) {
    return {
        //If no solar panel is given it will return an array of every solar panel on that date
        getToday: function (solar) {
            var now = new Date();
            //divide by 1000 to get seconds
            var date = Math.floor(new Date(now.getFullYear(), now.getMonth(), now.getDate()) / 1000);

            if (!solar) {
                var solar = "";
            } else {
                var solar = solar + "/";
            }
            return $http.get('http://127.0.0.1:1337/solar/generated/' + solar + date);
        }
    }
});