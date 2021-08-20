const Product = require('../models/product.model');

exports.create = (req, res, next) => {
  const product = new Product({
    name: req.body.name,
    category: req.body.category,
    gender: req.body.gender,
    price: req.body.price,
    markup: req.body.markup,
    discount: req.body.discount,
    free_delivery: req.body.free_delivery,
    productImage: {
      data: req.file.buffer,
      fileName: new Date().toISOString() + "-" + req.file.originalname,
      contentType: req.file.mimetype
    }
  });

  product.save()
    .then(data => {
      delete data.productImage;
      res.send({
        id: data._id,
        name: data.name,
        category: data.category,
        gender: data.gender,
        price: data.price,
        markup: data.markup,
        discount: data.discount,
        free_delivery: data.free_delivery,
        productImage: req.getUrl() + "/image/" + data._id
      })
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the product."
      });
    });

};

/* ow to calculate Display price = (Price + Markup % of Price) - (discount % of 
  Price)
  E.x: Price = 1000 
  Markup = 20%
  Discount = 10%
  Display price = (1000 + 200) - 100 
  Display price = 1100 */


function calculateDisplyPrice(data) {
  return data.price + (data.price / 100) * data.markup - (data.price / 100) * data.discount
}

exports.findAll = (req, res) => {
  const url = req.getUrl();
  var projection = {
    __v: false,
    'productImage': false
  };
  Product.find({}, projection)
    .then(products => {
      const response = products.map((data) => {
        return {
          id: data._id,
          name: data.name,
          category: data.category,
          gender: data.gender,
          price: data.price,
          markup: data.markup,
          discount: data.discount,
          displayPrice: calculateDisplyPrice(data),
          free_delivery: data.free_delivery,
          productImage: url + "/image/" + data._id
        }
      })
      res.send(response);
    }).catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving products."
      });
    });
};

exports.findOne = (req, res) => {
  Product.findById(req.params.productId)
    .then(product => {
      if (!product) {
        return res.status(404).send({
          message: "product not found with id " + req.params.productId
        });
      }
      const response = {
        id: product._id,
        name: product.name,
        category: product.category,
        gender: product.gender,
        price: product.price,
        markup: product.markup,
        discount: product.discount,
        free_delivery: product.free_delivery,
        productImage: req.getUrl() + "/image/" + product._id
      }
      res.send(response);
    }).catch(err => {
      if (err.kind === 'ObjectId') {
        return res.status(404).send({
          message: "product not found with id " + req.params.productId
        });
      }
      return res.status(500).send({
        message: "Error retrieving product with id " + req.params.productId
      });
    });
};

exports.update = (req, res) => {
  Product.findByIdAndUpdate(req.params.productId, {
    name: req.body.name,
    category: req.body.category,
    gender: req.body.gender,
    price: req.body.price,
    markup: req.body.markup,
    discount: req.body.discount,
    free_delivery: req.body.free_delivery,
    productImage: {
      data: req.file.buffer,
      fileName: new Date().toISOString() + "-" + req.file.originalname,
      contentType: req.file.mimetype
    }
  },
    { new: true })
    .then(product => {
      if (!product) {
        return res.status(404).send({
          message: "product not found with id " + req.params.productId
        });
      }
      delete product.productImage;
      res.send({
        id: product._id,
        name: product.name,
        category: product.category,
        gender: product.gender,
        price: product.price,
        markup: product.markup,
        discount: product.discount,
        free_delivery: product.free_delivery,
        productImage: req.getUrl() + "/image/" + product._id
      })
    }).catch(err => {
      if (err.kind === 'ObjectId') {
        return res.status(404).send({
          message: "product not found with id " + req.params.productId
        });
      }
      return res.status(500).send({
        message: "Error updating product with id " + req.params.productId
      });
    });
};

exports.delete = (req, res) => {
  Product.findByIdAndRemove(req.params.productId)
    .then(product => {
      if (!product) {
        return res.status(404).send({
          message: "product not found with id " + req.params.productId
        });
      }
      res.send({ message: "product deleted successfully!" });
    }).catch(err => {
      if (err.kind === 'ObjectId' || err.name === 'NotFound') {
        return res.status(404).send({
          message: "product not found with id " + req.params.productId
        });
      }
      return res.status(500).send({
        message: "Could not delete product with id " + req.params.productId
      });
    });
};