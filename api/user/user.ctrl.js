// API 로직
const models = require('../../models');

const index = (req, res) => {
  const limitString = req.query.limit || 10;
  const limit = parseInt(limitString, 10);

  if (Number.isNaN(limit)) {
    return res.status(400).end();
  }

  models.User.findAll({ limit }).then((users) => {
    res.json(users);
  });
};

const show = (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) return res.status(400).end();

  models.User.findOne({
    where: { id },
  }).then((user) => {
    if (!user) return res.status(404).end();
    res.json(user);
  });
};

const destroy = (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) return res.status(400).end();

  models.User.destroy({
    where: { id },
  }).then(() => {
    res.status(204).end();
  });
};

const create = (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).end();

  models.User.create({ name })
    .then((user) => {
      res.status(201).json(user);
    })
    .catch((err) => {
      if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).end();
      }
      res.status(500).end();
    });
};

const update = (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) return res.status(400).end();

  const { name } = req.body;
  if (!name) return res.status(400).end();

  models.User.findOne({ where: id }).then((user) => {
    if (!user) return res.status(404).end();

    user.name = name;

    user
      .save()
      .then(() => {
        res.json(user);
      })
      .catch((err) => {
        if (err.name === 'SequelizeUniqueConstraintError') {
          res.status(409).end();
        }
        res.status(500).end();
      });
  });
};

module.exports = {
  index,
  show,
  destroy,
  create,
  update,
};