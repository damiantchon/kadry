const express = require('express');
const router = express.Router();

const Publikacja = require('../models/publikacja');

router.post('/', (req, res) => {

   let publikacja = new Publikacja({
       autorzyWewnetrzniId: req.body.autorzyWewnetrzniId,
       autorzyZewnetrzni: req.body.autorzyZewnetrzni,
       tytulPublikacji: req.body.tytulPublikacji,
       tytulCzasopisma: req.body.tytulPublikacji,
       wolumin: req.body.wolumin,
       wydanie: req.body.wydanie,
       rokPublikacji: req.body.rokPublikacji,
       strony: req.body.strony,
       doi: req.body.doi,
       punkty: req.body.punkty
   });

   publikacja.save((err, result) => {
       if(err) {
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

router.get('/get', (req, res) => {
    Publikacja.find()
        .exec((err, publikacje) => {
            if (err) {
                return res.status(500).json({
                    title: 'An error occured',
                    error: err
                });
            }
            res.status(200).json({
                lista: publikacje
            });
        });
});

module.exports = router;