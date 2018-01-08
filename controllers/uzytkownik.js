const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/uzytkownik');

router.post('/', (req,res) => {
    let user = new User({
        "email": req.body.email,
        "password": bcrypt.hashSync(req.body.password, 10),
        "admin":req.body.admin
    });
    user.save((err, result) => {
        if(err) {
            return res.status(500).json({
                title: 'An error occured',
                error: err
            });
        }
        res.status(201).json({
            message: 'User created',
            obj: result
        })
    })
});

router.post('/login', (req,res) => {
    User.findOne({email: req.body.email}, (err, user) => {
        if(err) {
            return res.status(500).json({
                title: 'An error occured',
                error: err
            });
        }
        if (!user) {
            return res.status(401).json({
                title: 'Login failed',
                error: {nessage: 'bledne dane logowania'}
            });
        }
        if (!bcrypt.compareSync(req.body.password, user.password)) {
            return res.status(401).json({
                title: 'Login failed',
                error: {nessage: 'bledne dane logowania'}
            });
        }
        const token = jwt.sign({user: user}, 'mySecretKey', {expiresIn: 86400});
        res.status(200).json({
           message: 'Succesfully logged in',
           token: token,
           userId: user._id
        });
    });
});

router.post('/check', (req,res) => {
    let admin = false;
    User.findOne({_id: req.body.userId},(err, user) => {
        if(err) {
            admin = false;
            sendResponse();
        }else if (!user){
            admin = false;
            sendResponse();
        } else if (user) {
            admin = user.admin;
            sendResponse();
        }
    });

    function sendResponse() {
        jwt.verify(req.body.token, 'mySecretKey', (err, decoded) => {
            if (err) {
                return res.status(200).json({
                    message: 'Authentication failed',
                    auth: false,
                    admin: admin
                });
            }
            res.status(200).json({
                message: 'Authenticated',
                auth: true,
                admin: admin
            });
        });
    }
});

module.exports = router;