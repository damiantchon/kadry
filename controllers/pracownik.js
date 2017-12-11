const express = require('express');
const router = express.Router();

const Pracownik = require('../models/pracownik');

router.post('/', (req, res) => {

    let pracownik = new Pracownik({
        imie: req.body.imie,
        nazwisko: req.body.nazwisko,
        stopien: req.body.stopien,
        tytul: req.body.tytul,
        specjalnosc: req.body.specjalnosc,
        email: req.body.email,
        funkcje: req.body.funkcje
    });

    pracownik.save((err, result) => {
       if (err) {
           return res.status(500).json({
              title: 'An error occured',
              error: err
           });
       }
       res.status(201).json({
           message: 'Saved',
           obj: result
       });
    });
});

router.get('/get', (req, res) => {
    Pracownik.find()
        .exec((err, pracownicy) => {
            if (err) {
                return res.status(500).json({
                    title: 'An error occured',
                    error: err
                });
            }
            res.status(200).json({
                lista: pracownicy
            })
        });
});

module.exports = router;