const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseUniqueValidator = require('mongoose-unique-validator');

const schema = new Schema({
    "autorzyWewnetrzniId": [{type: Schema.Types.ObjectId, required: true, ref: 'Pracownik'}],
    "autorzyZewnetrzni": [{type: String, required: false}],
    "tytulPublikacji": {type: String, required: true},
    "tytulCzasopisma": {type: String, required: true},
    "wolumin": {type: String, required: true},
    "wydanie": {type: String, required: true},
    "rokPublikacji": {type: String, required: true},
    "strony": {type: String, required: true},
    "doi": {type: String, required: true, unique: true},
    "punkty": {type: Number, required: false}},
    {collection: "publikacje"});

schema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('Publikacja', schema);