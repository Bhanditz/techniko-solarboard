var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var http = require('http');
var path = require('path');
var favicon = require('serve-favicon');

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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(methodOverride());
app.use(favicon(path.join(__dirname, "public", "res", "favicon.ico")));
app.use(express.static(path.join(__dirname, 'public')));


var server = app.listen(app.get('port'), function() {
    console.log("App running on port " + this.address().port + "!");
});