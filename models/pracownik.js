const mongoose = require('mongoose');

const PracownikSchema = mongoose.Schema({
	imie: String,
	nazwisko: String
});

const Pracownik = module.exports = mongoose.model('Pracownik', PracownikSchema);