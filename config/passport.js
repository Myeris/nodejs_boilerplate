/**
 * Created by Marie Foussette on 09/04/15.
 */

/*global require*/
var LocalStrategy = require('passport-local').Strategy,
    User = require('../models/User'),
    bcrypt = require('bcrypt-nodejs');

module.exports = function (passport) {

    passport.serializeUser(function (User, done) {
        done(null, User);
    });

    passport.deserializeUser(function (user, done) {
        User.findOne({username: user.username}, function (err, User) {
            done(err, User);
        });
    });

    var passwordValidation = function (password, userPassword) {
        return bcrypt.compareSync(password, userPassword);
    };

    passport.use('local', new LocalStrategy(
        function (username, password, done) {

            User.findOne({
                username: username
            }, function (err, user) {

                if (err) {
                    return done(err);
                }

                if (!user || user.length === 0) {
                    return done(null, false, {message: 'Incorrect username'});
                }

                if (!passwordValidation(password, user.password)) {
                    return done(null, false, {message: 'Incorrect password'});
                }

                return done(null, user);
            });
        }
    ));

};

