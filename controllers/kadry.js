const express = require('express');
const router = express.Router();

const pracownik = require('../models/pracownik');

router.get('/', (req,res) => {
	res.send("GET");
});

router.post('/', (req,res,next) => {
	res.send("POST");
});

router.delete('/', (req,res,next) => {
	res.send("DELETE");
});

module.exports = router;