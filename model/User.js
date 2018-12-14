var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var {Follower, Following} = require('./Follows');

let CountSchema = new Schema({
    media: Number,
    follows: Number,
    followed_by: Number
}, {_id: false});

let schema = new Schema({
    _id: {type: Number, required: true},
    username: {type: String, required: true, index: true},
    profile_picture: String,
    full_name: String,
    access_token: String,
    counts: CountSchema
});

schema.virtual('followers', {
    ref: 'Follower',
    localField: '_id',
    foreignField: 'viewer',
    justOne: true
});

schema.virtual('followings', {
    ref: 'Following',
    localField: '_id',
    foreignField: 'viewer',
    justOne: true
});

module.exports = mongoose.model('User', schema);
