const express = require("express");
const router = express.Router();
const multer = require('multer');
const image = require('../controllers/image.controller.js');

const uploads = multer();

router.get('/:productId', image.getImage);

module.exports = router;