const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseUniqueValidator = require('mongoose-unique-validator');

const schema = new Schema({
    "rodzajPublikacji": {type: String, required: true},
    "autorzyWewnetrzniId": [{type: Schema.Types.ObjectId, required: true, ref: 'Pracownik'}],
    "autorzyZewnetrzni": [{type: String, required: false}],
    "redaktorzyWewnetrzniId": [{type: Schema.Types.ObjectId, required: false, ref: 'Pracownik'}],
    "redaktorzyZewnetrzni": [{type: String, required: false}],
    "tytulPublikacji": {type: String, required: true},
    "rokPublikacji": {type: Number, required: true},
    "jezykPublikacji": {type: String, required: true},
    "tytulCzasopisma": {type: String, required: false},
    "zeszyt": {type: String, required: false},
    "strony": {type: String, required: false},
    "tytulRozdzialu": {type: String, required: false},
    "ISSN": {type: String, required: false},
    "ISBN": {type: String, required: false},
    "wydawnictwo": {type: String, required: false},
    "DOI": {type: String, required: false},
    "punkty": {type: Number, required: true}},
    {collection: "publikacje"});

schema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('Publikacja', schema);