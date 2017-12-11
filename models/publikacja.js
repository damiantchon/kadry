const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    nazwa: {type: String, required: true},
    autorzy: [{type: Schema.Types.ObjectId, ref: 'Pracownik'}],

});

module.exports = mongoose.model('Publikacja', schema);