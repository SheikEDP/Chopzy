const { Category } = require('../models');

exports.getAll = async (req, res) => {
  const cats = await Category.findAll({ order: [['sort_order', 'ASC']] });
  res.json({ success: true, data: cats });
};

exports.create = async (req, res) => {
  const cat = await Category.create(req.body);
  res.status(201).json({ success: true, data: cat });
};

exports.update = async (req, res) => {
  const cat = await Category.findByPk(req.params.id);
  if (!cat) return res.status(404).json({ success: false });
  await cat.update(req.body);
  res.json({ success: true, data: cat });
};

exports.delete = async (req, res) => {
  const cat = await Category.findByPk(req.params.id);
  if (!cat) return res.status(404).json({ success: false });
  await cat.destroy();
  res.json({ success: true });
};