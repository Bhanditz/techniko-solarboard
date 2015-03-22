  app.filter('capitalize', function() {
      return function(input, all) {
          if (input)
              return input.charAt(0).toUpperCase() + input.substr(1);
      };
  });