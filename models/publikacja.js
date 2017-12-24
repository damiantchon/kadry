const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    "autorzyWewnetrzni": [{type: Schema.Types.ObjectId, required: true, ref: 'Pracownik'}],
    "autorzyZewnetrzni": [{type: String, required: false}],
    "tytulPublikacji": {type: String, required: true},
    "tytulCzasopisma": {type: String, required: true},
    "wolumin": {type: String, required: true},
    "wydanie": {type: String, required: true},
    "rokPublikacji": {type: String, required: true},
    "strony": {type: String, required: true},
    "doi": {type: String, required: true},
    "punkty": {type: Number, required: false}},
    {collection: "publikacje"});

module.exports = mongoose.model('Publikacja', schema);