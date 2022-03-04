var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    login: String,
    pass: String,
    display: String
});

module.exports = mongoose.model('User', UserSchema);