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
       autorzyWewnetrzniId: req.body.autorzyWewnetrzniId,
       autorzyZewnetrzni: req.body.autorzyZewnetrzni,
       tytulPublikacji: req.body.tytulPublikacji,
       tytulCzasopisma: req.body.tytulCzasopisma,
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

router.put('/', (req, res) => {
    let publikacja = new Publikacja({
        _id: req.body._id,
        autorzyWewnetrzniId: req.body.autorzyWewnetrzniId,
        autorzyZewnetrzni: req.body.autorzyZewnetrzni,
        tytulPublikacji: req.body.tytulPublikacji,
        tytulCzasopisma: req.body.tytulCzasopisma,
        wolumin: req.body.wolumin,
        wydanie: req.body.wydanie,
        rokPublikacji: req.body.rokPublikacji,
        strony: req.body.strony,
        doi: req.body.doi,
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