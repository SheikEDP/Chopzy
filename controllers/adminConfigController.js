const { AppConfig } = require('../models');

exports.get = async (req, res) => {
  let config = await AppConfig.findByPk(1);
  if (!config) config = await AppConfig.create({ id: 1 });
  res.json({ success: true, data: config });
};

exports.update = async (req, res) => {
  const config = await AppConfig.findByPk(1);
  await config.update(req.body);
  res.json({ success: true, data: config });
};