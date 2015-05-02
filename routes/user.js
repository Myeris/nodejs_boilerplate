/**
 * Created by Marie Foussette on 01/05/15.
 */

/*global require, next*/
var User = require('../models/User'),
    bcrypt = require('bcrypt-nodejs');

module.exports = function (app) {

    var auth = function (req, res, next) {
        if (!req.isAuthenticated()) {
            res.sendStatus(401);
        } else {
            next();
        }
    };

    var generatePassword = function (password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    };

    app.get('/api/user', function (req, res) {
        User.find(function (err, users) {
            if (err) {
                res.send(err);
            }

            res.json(users);
        });
    });

    app.get('/api/user/:id', auth, function (req, res) {
        User.findById(req.params.id, function (err, user) {
            if (user) {
                res.json(user);
            } else {
                res.send(404);
            }
        });
    });

    // Create new user
    app.post('/api/user', auth, function (req, res) {
        var newUser = req.body;
        User.create({
            username: newUser.username,
            password: generatePassword(newUser.password),
            created_at: new Date(),
            updated_at: new Date()
        }, function (err, user) {
            if (err) {
                res.send(err);
            }

            res.json(user);
        });
    });

    app.put('/api/user/:id', auth, function (req, res) {
        User.findById(req.params.id, function (err, user) {
            if (err) {
                res.send(err);
            }

            var updateUser = req.body;

            user.name = updateUser.name;
            user.password = generatePassword(updateUser.password);
            user.updated_at = new Date();

            user.save();

            res.json(user);
        });
    });

    app.delete('/api/user/:id', auth, function (req, res) {
        User.remove({
            _id: req.params.id
        }, function (err, user) {
            if (err) {
                res.send(err);
            }

            res.sendStatus(200);
        });
    });


};