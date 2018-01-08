const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const MinimumKadrowe = require('../models/minimum-kadrowe');


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

router.post('/', (req,res) => {
   let minimumKadrowe = new MinimumKadrowe({
       kierunek: req.body.kierunek,
       stopien: req.body.stopien,
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
        stopien: req.body.stopien,
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

router.post('/checkValidity', (req, res) => {
   MinimumKadrowe.find({rokAkademicki: req.body.rokAkademicki})
       .exec((err, minima) => {
           if(err) {
               res.status(200).json({
                   message: 'Validity',
                   valid: true,
                   minima: ''
               });
           }

           let tegoroczneMinimaKadrowe = minima;
           let minimaKadrowePracownika = [];

           let pracownikId = req.body.pracownikId;
           tegoroczneMinimaKadrowe.forEach((minimum) => {
                 if(minimum.doktorzy.indexOf(pracownikId) >= 0 || minimum.doktorzyHabilitowani.indexOf(pracownikId) >= 0){
                   minimaKadrowePracownika.push(minimum);
                 }
               });

           //check if minimaKadrowePracownika contains currently edited minimum - if yes, delete this minimum so there is no duplicates
           let deleteMe = minimaKadrowePracownika.findIndex((minimum) => {
              return (minimum.kierunek === req.body.kierunek
                  && minimum.stopien === req.body.stopien
                  && minimum.rokAkademicki === req.body.rokAkademicki);
           });

           if(deleteMe >= 0) {
               minimaKadrowePracownika.splice(deleteMe, 1);
           }

           minimaKadrowePracownika.push(req.body);

           let tempMinimaNames = '';
           minimaKadrowePracownika.forEach((minimum) => {
             tempMinimaNames = tempMinimaNames.concat(minimum.kierunek.bold() + ' (' + minimum.stopien + ' stopien), ');
           });

           let validity = setupIsCorrect(minimaKadrowePracownika);

           res.status(200).json({
               message: 'Validity',
               valid: validity,
               minima: tempMinimaNames
           });

       });


    function setupIsCorrect(minimaKadrowe) {
        if (minimaKadrowe.length === 1) {
            return true;
        } else if (minimaKadrowe.length === 2) {
            if (minimaKadrowe[0].stopien === 'pierwszy' || minimaKadrowe[1].stopien === 'pierwszy') {
                return true;
            }
        } else if (minimaKadrowe.length === 3) {
            let minimaPierwszegoStopnia = minimaKadrowe.filter((minimum) => {
                return minimum.stopien === 'pierwszy';
            });
            let minimaDrugiegoStopnia = minimaKadrowe.filter((minimum) => {
                return minimum.stopien === 'drugi';
            });
            if (minimaPierwszegoStopnia.length === 2) {
                if (minimaPierwszegoStopnia[0].kierunek === minimaDrugiegoStopnia[0].kierunek ||
                    minimaPierwszegoStopnia[1].kierunek === minimaDrugiegoStopnia[0].kierunek) {
                    return true;
                }
            }
        }
        return false;
    }

});



module.exports = router;