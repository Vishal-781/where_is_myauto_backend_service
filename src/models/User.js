const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    role : {
        type: String,
        required: true,
        default: 'user'
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    token : {
        type: String
    }
});

module.exports = mongoose.model('User', UserSchema);