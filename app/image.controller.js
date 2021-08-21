const Product = require('../models/product.model');

exports.getImage = (req, res) => {
  Product.findById(req.params.productId)
    .then(product => {
      if (!product) {
        return res.status(404).send({
          message: "Productimage not found with id " + req.params.productId
        });
      }
      res.contentType(product.productImage.contentType);
      res.send(product.productImage.data);
    }).catch(err => {
      if (err.kind === 'ObjectId') {
        return res.status(404).send({
          message: "Product image not found with id " + req.params.productId
        });
      }
      return res.status(500).send({
        message: "Error retrieving product image with id " + req.params.productId
      });
    });
};

