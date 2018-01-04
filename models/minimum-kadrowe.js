const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
        "kierunek": {type: String, required: true},
        "stopien": {type: String, required: true},
        "rokAkademicki": {type: String, required: true},
        "doktorzyHabilitowani": [{type: Schema.Types.ObjectId, ref: 'Pracownik'}],
        "doktorzy": [{type: Schema.Types.ObjectId, ref: 'Pracownik'}],
        "poprawne": {type: Boolean, required: true}},
    {collection: 'minima-kadrowe'});

module.exports = mongoose.model('MinimumKadrowe', schema);