const express = require("express");
const router = express.Router();
const multer = require('multer');
const products = require('../controllers/product.controller.js');

var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

router.post('/', upload.single('productImage'), products.create);
router.get('/', products.findAll);
router.get('/:productId', products.findOne);
router.put('/:productId', upload.single('productImage'), products.update);
router.delete('/:productId', products.delete);

module.exports = router;