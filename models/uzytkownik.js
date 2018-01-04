const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseUniqueValidator = require('mongoose-unique-validator');

const schema = new Schema({
    "email": {type: String, requried: true, unique: true},
    "password": {type: String, required: true},
    "admin": {type: Boolean, required: true}},
    {collection: "users"}
);

schema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('Uzytkownik', schema);