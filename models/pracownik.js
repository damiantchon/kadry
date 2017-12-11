const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseUniqueValidator = require('mongoose-unique-validator');

const schema = new Schema({
	"imie": {type: String, required: true},
	"nazwisko": {type: String, required: true},
    "stopien": {type: String, required: true},
    "tytul": {type: String, required: true},
    "specjalnosc": {type: String, required: true},
    "email": {type: String, required: true, unique: true},
    "funkcje": [{type: String, required: false}],
    "publikacje": [{type: Schema.Types.ObjectId, ref: 'Publikacja', required: false}]},
    {collection: 'pracownicy'});

schema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('Pracownik', schema);