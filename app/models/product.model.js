const mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

const productSchema = new Schema({
  productId: ObjectId,
  name: {
    type: String,
    required: true
  },
  category:{
    type: String,
    required: true
  },
  gender:{
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  markup:{
    type: Number,
    required: true
  },
  discount:{
    type: Number,
    required: true
  },
  free_delivery: {
    type: Boolean,
    required: true
  },
  productImage: {
    data: {
      type: Buffer,
      required: true
    },
    contentType: {
      type: String,
      required: true
    },
    fileName: {
      type: String,
      required: true
    },
  }
});

module.exports = mongoose.model('Product', productSchema);