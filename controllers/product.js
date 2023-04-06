const moment = require('moment');
const cache = require('memory-cache');

const ProductModel = require('../models/Product');
const UserModel = require('../models/User');
const ProductDTO = require('../dtos/productDTO');

const getAllProducts = async (req, res) => {
  try {
    const cachedProducts = cache.get('allProducts');
    if (cachedProducts) {
      return res.json({ status: 200, message: cachedProducts });
    }

    const products = await ProductModel.find({});

    cache.put('allProducts', products, 259200000); // 3 дня
    res.json({ status: 200, message: products });
  } catch (error) {
    req.logger.error(error);
    res.json({
      status: 500,
      message: 'Ошибка сервера. Повторите попытку позже!',
    });
  }
};

const getUserProducts = async (req, res) => {
  try {
    const cachedProducts = cache.get('userProducts');
    if (cachedProducts) {
      return res.json({ status: 200, message: cachedProducts });
    }

    const userProducts = [];

    // fetch
    const uniqueProducts = await UserModel.findById(req.userId).distinct(
      'products.productId'
    );
    const { products } = await UserModel.findById(req.userId).populate({
      path: 'products.productId',
    });

    // create products layout
    for (let i = 0; i < uniqueProducts.length; i++) {
      const productDTO = new ProductDTO(uniqueProducts[i]);
      userProducts.push(productDTO);
    }

    // add product fields
    for (let i = 0; i < userProducts.length; i++) {
      for (let j = 0; j < products.length; j++) {
        const productsChild = products[j].productId;
        if (userProducts[i].id.toString() === productsChild._id.toString()) {
          const currentTime = new Date();
          const collectTime = products[j].collectAt;
          const hoursSince = moment
            .duration(currentTime - collectTime)
            .asHours();
          const collectedIncome = Math.round(
            hoursSince * productsChild.incomePerHour
          );

          userProducts[i].income += collectedIncome;
          userProducts[i].count++;
          userProducts[i].name = productsChild.name;
        }
      }
    }

    cache.put('userProducts', userProducts, 3000); // 3 секунды
    res.json({ status: 200, message: userProducts });
  } catch (error) {
    req.logger.error(error);
    res.json({
      status: 500,
      message: 'Ошибка сервера. Повторите попытку позже!',
    });
  }
};

const collectIncome = async (req, res) => {
  try {
    const user = await UserModel.findById(
      req.userId,
      'wallet products'
    ).populate('products.productId', 'incomePerHour');

    let sumOfAllIncome = 0;

    for (let i = 0; i < user.products.length; i++) {
      const currentTime = new Date();
      const collectTime = user.products[i].collectAt;

      const hoursSince = moment.duration(currentTime - collectTime).asHours();
      const collectedIncome = Math.round(
        hoursSince * user.products[i].productId.incomePerHour
      );

      sumOfAllIncome += collectedIncome;
      user.products[i].collectAt = currentTime;
    }

    sumOfAllIncome += user.wallet.coins;
    await user.save();
    res.json({ status: 200, message: sumOfAllIncome });
  } catch (error) {
    req.logger.error(error);
    res.json({
      status: 500,
      message: 'Ошибка сервера. Повторите попытку позже!',
    });
  }
};

const buyProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await UserModel.findById(req.userId, 'products');

    user.products.push({ productId });
    await user.save();

    res.json({ status: 200, message: 'Благодарим за покупку' });
  } catch (error) {
    req.logger.error(error);
    res.json({
      status: 500,
      message: 'Ошибка сервера. Повторите попытку позже!',
    });
  }
};

module.exports = { getAllProducts, buyProduct, getUserProducts, collectIncome };
