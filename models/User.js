const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
  login: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  wallet: {
    balanceToBuy: {
      type: Number,
      default: 399,
    },
    balanceToWithdraw: {
      type: Number,
      default: 0,
    },
    coins: {
      type: Number,
      default: 0,
    },
  },
  products: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Product',
      },
      collectAt: { type: Date, default: Date.now },
    },
  ],
  bonus: {
    type: Date,
    default: Date.now() - 86400000,
  },
  role: {
    type: String,
    default: 'User',
  },
  referrer: {
    type: String,
    default: 'Anonym',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model('User', UserSchema);
