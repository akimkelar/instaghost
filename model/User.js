var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var {Follower, Following} = require('./Follows');

let schema = new Schema({
    _id: {type: Number, required: true},
    username: {type: String, required: true},
    password: String,
    token: String,
    avatar: String,
    cookies: {type: Map, of: String},
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

let User = mongoose.model('User', schema);

User.getCookiesObject = function () {
    let cookies = {};
    this.cookies.forEach((v,k) => {cookies[k] = v});
    return cookies;
};

User.setCookiesFromObject = function(obj) {
    Object.entries(obj).forEach(([k,v]) => {
        this.cookies.set(k,v);
    });
    return this.cookies;
};

module.exports = User;
