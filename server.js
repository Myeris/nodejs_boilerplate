/**
 * Created by Marie Foussette on 02/04/15.
 */

/*global require, console, __dirname, process*/

// set up =================
var express = require('express'),
    session = require('express-session'),
    app = express(),
    mongoose = require('mongoose'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    path = require('path'),
    passport = require('passport'),
    nodemailer = require('nodemailer'),
    smtpTransport = require('nodemailer-smtp-transport'),
    fs = require('fs'),
    database = require('./config/database'),
    port = process.env.PORT || 8080,
    appPath = path.normalize(__dirname + '/app/'); // TODO config the path to your app

// configuration ==========
mongoose.connect(database.url);

app.use('/app/', express.static(appPath));

app.use(session({
    secret: 'iloveyoueverythingburrito',
    resave: true,
    saveUninitialized: true
}));

app.use(morgan('dev'));                                         // log every request to the console
var accessLogStream = fs.createWriteStream(__dirname + '/logs/log.log', {
    flags: 'a'
});                                                             // create a write stream (in append mode)
app.use(morgan('combined', {stream: accessLogStream}));         // setup the logger

app.use(bodyParser.urlencoded({'extended': 'true'}));           // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({type: 'application/vnd.api+json'}));   // parse application/vnd.api+json as json
app.use(methodOverride());

app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);
require('./config/nodemailer')(nodemailer, smtpTransport, app);

// models =================
require('./models/User');

// routes =================
require('./routes/authenticate')(app, passport);

// application ============
app.get('*', function (req, res) {
    res.sendFile(appPath + '/index.html');
});

// listen =================
app.listen(port);
console.log("App listening on port " + port);


