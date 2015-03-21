  app.filter('capitalize', function() {
      return function(input, all) {
          return input.charAt(0).toUpperCase() + input.substr(1);
      };
  });