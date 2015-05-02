/**
 * Created by Marie Foussette on 09/04/15.
 */

/*global require*/
var User = require('../models/User');

module.exports = function (app, passport) {

    var auth = function (req, res, next) {
        if (!req.isAuthenticated()) {
            res.sendStatus(401);
        } else {
            next();
        }
    };

    app.get('/api/loggedin', function (req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    });

    app.post('/api/login', passport.authenticate('local'), function (req, res) {
        res.sendStatus(200);
    });

    app.post('/api/logout', function (req, res) {
        req.logOut();
        res.sendStatus(200);
    });

    app.get('/api/admin', auth);

};