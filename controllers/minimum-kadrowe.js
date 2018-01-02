const express = require('express');
const router = express.Router();

const MinimumKadrowe = require('../models/minimum-kadrowe');


router.post('/', (req,res) => {
   let minimumKadrowe = new MinimumKadrowe({
       kierunek: req.body.kierunek,
       rokAkademicki: req.body.rokAkademicki,
       doktorzyHabilitowani: req.body.doktorzyHabilitowani,
       doktorzy: req.body.doktorzy,
       poprawne: req.body.poprawne
   });

   minimumKadrowe.save((err, result) => {
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
   })
});

router.put('/', (req, res) => {
    let minimumKadrowe = new MinimumKadrowe({
        _id: req.body._id,
        kierunek: req.body.kierunek,
        rokAkademicki: req.body.rokAkademicki,
        doktorzyHabilitowani: req.body.doktorzyHabilitowani,
        doktorzy: req.body.doktorzy,
        poprawne: req.body.poprawne
    });

    MinimumKadrowe.update({_id: req.body._id}, minimumKadrowe, (err, result ) => {
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
    })
});

router.delete('/:id', (req, res) => {
    MinimumKadrowe.find({_id: req.params.id}).remove((err, result) => {
        if(err) {
            return res.status(500).json({
                title: 'An error occured (DELETE minimumKadrowe)',
                error: err
            });
        }
        res.status(200).json({
            message: 'Pracownik deleted',
            obj: result
        });
    });
});

router.get('/get', (req, res) => {
    MinimumKadrowe.find()
        .exec((err, minima) => {
            if (err) {
                return res.status(500).json({
                    title: 'An error occured',
                    error: err
                });
            }
            res.status(200).json({
                lista: minima
            });
        });
});

module.exports = router;