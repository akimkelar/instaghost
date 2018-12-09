var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('./User');

var schema = new Schema({
    //from followers feed
    viewer:                     {type: Schema.Types.ObjectId, required:true, index: true, ref: 'User'},
    id:                         {type: Number, required: true, index: true},
    username:                   {type: String, required: true, index: true},
    full_name:                  String,
    profile_pic_url:            String,
    is_private:                 Boolean,
    is_verified:                Boolean,
    followed_by_viewer:         Boolean,
    requested_by_viewer:        Boolean,

    //from user page
    biography:                  String,
    external_url:               String,
    has_profile_pic:            Boolean,
    edge_followed_by:           Number,
    edge_follow:                Number,
    follows_viewer:             Boolean,
    has_blocked_viewer:         Boolean,
    has_requested_viewer:       Boolean,
    is_business_account:        Boolean,
    is_joined_recently:         Boolean,
    connected_fb_page:          String,
    timeline_media_count:       Number,

    //derivative fields
    ff_ratio:                   Number,
    likes:                      {type: Map, of: Number},
    comments:                   {type: Map, of: Number},

    score:                      {type: Number, index: true},
    updated:                    {type: Date, default: Date.now}
});

schema.methods.updateScore = function (cb) {
    let score = 0;
    let base = 100;
    let fieldWeights = {
        full_name:                  .6,
        profile_pic_url:            .6,
        is_private:                 .2,
        is_verified:                .3,
        followed_by_viewer:         .9,
        requested_by_viewer:        .7,

        //from user page
        biography:                  .4,
        external_url:               .6,
        has_profile_pic:            .7,
        edge_followed_by:           .5,
        edge_follow:                .5,
        follows_viewer:             1,
        has_blocked_viewer:         1,
        has_requested_viewer:       .3,
        is_business_account:        .4,
        is_joined_recently:         .8,
        connected_fb_page:          .6,
        timeline_media_count:       .8,

        //derivative fields
        ff_ratio:                   1,
    };
    let valueWeights = {
        full_name:                  {"val==null||val.length==0":0, "val.length>0":1},
        profile_pic_url:            {"val==null||val.length==0":0, "val.length>0":1},
        is_private:                 {"val==true":0, "val==false":1},
        is_verified:                {"val==true":1, "val==false":0},
        followed_by_viewer:         {"val==true":1, "val==false":0},
        requested_by_viewer:        {"val==true":1, "val==false":0},

        //from user page
        biography:                  {"val==null||val.length==0":0, "val.length>0":1},
        external_url:               {"val==null||val.length==0":1, "val.length>0":0},
        has_profile_pic:            {"val==true":1, "val==false":0},
        edge_followed_by:           {"val<=200":0, "val<=500":.3, "val<=1000":.5, "val<=2000":.7, "val<=10000":.9, "val<=20000":.7, "val<=50000":.5, "val>50000":.1},
        edge_follow:                {"val<=200":.9, "val<=500":.7, "val<=1000":.5, "val<=2000":.3, "val>2000":0},
        follows_viewer:             {"val==true":1, "val==false":0},
        has_blocked_viewer:         {"val==true":0, "val==false":1},
        has_requested_viewer:       {"val==true":1, "val==false":0},
        is_business_account:        {"val==true":.5, "val==false":1},
        is_joined_recently:         {"val==true":0, "val==false":1},
        connected_fb_page:          {"val==true":1, "val==false":0},
        timeline_media_count:       {"val<=20":0, "val<=50":.2, "val<=100":.5, "val<=200":.7, "val<=500":.9, "val<=1000":.5, "val<=2000":.2, "val<=5000":.1, "val>5000":0},

        //derivative fields
        //followings/followers
        ff_ratio:                   {"val<=.01":1, "val<=.02":.9, "val<=0.05":.8, "val<=.1":.7, "val<=.2":.6, "val<=.3":.5, "val<=.4":.4, "val<=.5":.3, "val<=.8":.2, "val<1":.1, "val>=1":0},
    };

    Object.keys(fieldWeights).forEach(field => {
        let val = this[field];
        let valWeight = 0;
        Object.keys(valueWeights[field]).forEach(condition => {
            if (eval(condition)) {
                valWeight = valueWeights[field][condition];
            }
        });
        score += fieldWeights * valWeight;
    });
    this.score = Math.round(score / Object.keys(fieldWeights).length * base);
    this.markModified('score');
};

module.exports.Follower = mongoose.model('Follower', schema);
module.exports.Following = mongoose.model('Following', schema);