/**
 * Created by Marie Foussette on 09/04/15.
 */

/* global require*/
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    created_at: Date,
    updated_at: Date
});

var User = mongoose.model('User', userSchema);

// methods ============

// export =============
module.exports = User;