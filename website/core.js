var express = require('express'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    morgan = require('morgan'),
    http = require('http'),
    path = require('path');

var app = module.exports = express();


if (app.get('env') == 'development') {
    var browserSync = require('browser-sync');
    var bs = browserSync({
        logSnippet: false,
        // Serve files from the app directory
        server: {
            baseDir: "public",
            directory: true
        },
        files: "public/**"
    });
    app.use(require('connect-browser-sync')(bs));
    console.log("Browsersync has been activated");
}

/**
 * Configuration
 */

// all environments
app.set('port', process.env.PORT || 3000);
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));


var server = app.listen(app.get('port'), function() {
    console.log("App running on port " + this.address().port + "!");
});