const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const Pracownik = require('../models/pracownik');

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
            });
        });
});

router.use('/',(req, res, next) => {
    jwt.verify(req.query.token, 'mySecretKey', (err, decoded) => {

        if (err) {
            return res.status(401).json({
                title: 'Authentication failed',
                error: err
            });
        }
        next();
    });
});

router.get('/przedmiot-raport/:przedmiot', (req, res) => {
    let przedmiot = req.params.przedmiot;

    Pracownik.find({"przedmioty": { "$regex": przedmiot, "$options": "i" }})
        .exec((err, pracownicy) => {
            if (err) {
                return res.status(500).json({
                    title: 'An error occured',
                    error: err
                });
            }
            res.status(200).json({
                lista: pracownicy
            });
        });
});

router.post('/', (req, res) => {
    console.log(req);

    let pracownik = new Pracownik({
        imie: req.body.imie,
        nazwisko: req.body.nazwisko,
        stopien: req.body.stopien,
        tytul: req.body.tytul,
        specjalnosc: req.body.specjalnosc,
        email: req.body.email,
        przedmioty: req.body.przedmioty,
        funkcje: req.body.funkcje
    });

    pracownik.save((err, result) => {
       if (err) {
           return res.status(500).json({
              title: 'An error occured',
              error: err
           });
       }
       res.status(200).json({
           message: 'Saved',
           obj: result
       });
    });
});

router.put('/', (req, res)=>{

    let pracownik = new Pracownik({
        _id: req.body._id,
        imie: req.body.imie,
        nazwisko: req.body.nazwisko,
        stopien: req.body.stopien,
        tytul: req.body.tytul,
        specjalnosc: req.body.specjalnosc,
        email: req.body.email,
        przedmioty: req.body.przedmioty,
        funkcje: req.body.funkcje
    });


    Pracownik.update({_id: req.body._id}, pracownik, (err, result) => {
        if (err) {
            return res.status(500).json({
                title: 'An error occured',
                error: err
            });
        }
        res.status(200).json({
            message: 'Saved',
            obj: result
        });
    });
});

router.delete('/:id', (req, res) => {

    Pracownik.find({_id: req.params.id}).remove((err, result) => {
        if(err) {
            return res.status(500).json({
                title: 'An error occured (DELETE pracownik)',
                error: err
            });
        }
        res.status(200).json({
            message: 'Pracownik deleted',
            obj: result
        });
    });
});



module.exports = router;