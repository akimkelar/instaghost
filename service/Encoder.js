var crypto = require('crypto');

let Encoder = {
    algorithm: 'aes-256-ctr',
    password: 'S4%dG#dF',
    secretKey: 's$g6H$d5',
    devider: ':',

    encrypt: function (text) {
        var cipher = crypto.createCipher(this.algorithm, this.password)
        var crypted = cipher.update(text, 'utf8', 'hex')
        crypted += cipher.final('hex');
        return crypted;
    },

    decrypt: function (text) {
        var decipher = crypto.createDecipher(this.algorithm, this.password)
        var dec = decipher.update(text, 'hex', 'utf8')
        dec += decipher.final('utf8');
        return dec;
    },

    getKey: function () {
        let valid = new Date();
        valid.setDate(valid.getDate() + 1);
        return this.encrypt(this.secretKey + this.devider + valid.getTime() + this.devider + Math.round(Math.random()*1000000000));
    },

    checkKey: function (key) {
        let text = this.decrypt(key);
        let [secret, valid] = text.split(this.devider);
        valid = new Date(valid);
        let now = new Date();
        return secret == this.secretKey && valid.getTime() >= now.getTime();
    }
};

module.exports = Encoder;
