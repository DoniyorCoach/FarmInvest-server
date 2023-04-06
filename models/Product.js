const { Schema, model } = require('mongoose');

const ProductSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  incomePerHour: {
    type: Number,
    required: true,
  },
});

module.exports = model('Product', ProductSchema);
