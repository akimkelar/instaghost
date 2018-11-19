var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var {Follower, Following} = require('./Follows');

let schema = new Schema({
    _id: {type: Number, required: true},
    username: {type: String, required: true},
    password: String,
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