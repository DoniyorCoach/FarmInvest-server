const moment = require('moment');
const User = require('../models/User');

const getWallet = async (req, res) => {
  try {
    const { wallet } = await User.findById(req.userId, 'wallet');
    res.json(wallet);
  } catch (error) {
    req.logger.error(error);
    res.json({
      status: 500,
      message: 'Ошибка сервера. Повторите попытку позже!',
    });
  }
};

const setWallet = async (req, res) => {
  try {
    const { balanceToBuy, balanceToWithdraw, coins } = req.body.wallet;

    await User.findByIdAndUpdate(req.userId, {
      wallet: {
        balanceToBuy,
        balanceToWithdraw,
        coins,
      },
    });
    res.json('updated');
  } catch (error) {
    req.logger.error(error);
    res.json({
      status: 500,
      message: 'Ошибка сервера. Повторите попытку позже!',
    });
  }
};

const getBonus = async (req, res) => {
  try {
    const user = await User.findById(req.userId, 'bonus wallet');

    const randomBonus = Number((Math.random() * 4.01 + 1).toFixed(2));
    const currentTime = new Date();
    const daysSince = moment.duration(currentTime - user.bonus).asDays();

    if (daysSince < 1) {
      const nextBonus = moment(user.bonus).add(1, 'd');
      const leftMinutes = moment.duration(nextBonus - currentTime).asSeconds();

      const hours = Math.floor(leftMinutes / 60 / 60);
      const minutes = Math.floor(leftMinutes / 60) - hours * 60;
      const seconds = Math.floor(leftMinutes % 60);

      return res.json({
        status: 400,
        message: `Следующий бонус будет доступен через ${hours} ч ${minutes} мин ${seconds} сек`,
      });
    }

    user.bonus = currentTime;
    await user.save();

    res.json({
      status: 200,
      message: randomBonus,
    });
  } catch (error) {
    req.logger.error(error);
    res.json({
      status: 500,
      message: 'Ошибка сервера. Повторите попытку позже!',
    });
  }
};

module.exports = { getWallet, setWallet, getBonus };
