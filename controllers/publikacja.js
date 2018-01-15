const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const Publikacja = require('../models/publikacja');

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

router.post('/', (req, res) => {

   let publikacja = new Publikacja({
       rodzajPublikacji: req.body.rodzajPublikacji,
       autorzyWewnetrzniId: req.body.autorzyWewnetrzniId,
       autorzyZewnetrzni: req.body.autorzyZewnetrzni,
       redaktorzyWewnetrzniId: req.body.redaktorzyWewnetrzniId,
       redaktorzyZewnetrzni: req.body.redaktorzyZewnetrzni,
       tytulPublikacji: req.body.tytulPublikacji,
       rokPublikacji: req.body.rokPublikacji,
       jezykPublikacji: req.body.jezykPublikacji,
       tytulCzasopisma: req.body.tytulCzasopisma,
       zeszyt: req.body.zeszyt,
       strony: req.body.strony,
       tytulRozdzialu: req.body.tytulRozdzialu,
       ISSN: req.body.ISSN,
       wydawnictwo: req.body.wydawnictwo,
       ISBN: req.body.ISBN,
       DOI: req.body.DOI,
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

router.put('/', (req, res) => {
    let publikacja = new Publikacja({
        _id: req.body._id,
        rodzajPublikacji: req.body.rodzajPublikacji,
        autorzyWewnetrzniId: req.body.autorzyWewnetrzniId,
        autorzyZewnetrzni: req.body.autorzyZewnetrzni,
        redaktorzyWewnetrzniId: req.body.redaktorzyWewnetrzniId,
        redaktorzyZewnetrzni: req.body.redaktorzyZewnetrzni,
        tytulPublikacji: req.body.tytulPublikacji,
        rokPublikacji: req.body.rokPublikacji,
        jezykPublikacji: req.body.jezykPublikacji,
        tytulCzasopisma: req.body.tytulCzasopisma,
        zeszyt: req.body.zeszyt,
        strony: req.body.strony,
        tytulRozdzialu: req.body.tytulRozdzialu,
        ISSN: req.body.ISSN,
        ISBN: req.body.ISBN,
        wydawnictwo: req.body.wydawnictwo,
        DOI: req.body.DOI,
        punkty: req.body.punkty
    });

    Publikacja.update({_id: req.body._id}, publikacja, (err, result) => {
        if(err) {
            return res.status(500).json({
                title: 'An error occured (DELETE publikacja)',
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
   Publikacja.find({_id: req.params.id}).remove((err, result) => {
      if(err) {
          return res.status(500).json({
             title: 'An error occured while deleting publikacja.',
             error: err
          });
      }
      res.status(200).json({
          message: 'Publikacja deleted',
          obj: result
      })
   });
});



module.exports = router;