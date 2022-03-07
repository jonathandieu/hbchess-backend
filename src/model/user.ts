var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    login: {type: String, required: true, unique: true},
    pass: {type: String, required: true},
    display: {type: String, required: true, index: true}
});

module.exports = mongoose.model('User', UserSchema);