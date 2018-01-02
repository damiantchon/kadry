const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
        "kierunek": {type: String, required: true},
        "rokAkademicki": {type: String, required: true},
        "doktorzyHabilitowani": [{type: Schema.Types.ObjectId, ref: 'Pracownik'}],
        "doktorzy": [{type: Schema.Types.ObjectId, ref: 'Pracownik'}],
        "poprawne": {type: Boolean, required: true}},
    {collection: 'minima-kadrowe'});

// const mongooseUniqueValidator = require('mongoose-unique-validator');
//
// const schema = new Schema({
//         "imie": {type: String, required: true},
//         "nazwisko": {type: String, required: true},
//         "stopien": {type: String},
//         "tytul": {type: String, required: true},
//         "specjalnosc": {type: String, required: true},
//         "email": {type: String, required: true, unique: true},
//         "funkcje": [{type: String, required: false}]},
//     {collection: 'pracownicy'});
//
// schema.plugin(mongooseUniqueValidator);
//
module.exports = mongoose.model('MinimumKadrowe', schema);