const Sauce = require('../models/sauces');
const fs = require('fs');
const { find } = require('../models/sauces');
const { stringify } = require('querystring');

exports.getAllSauces = (req, res, next) => {
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

exports.createSauce = (req, res, next) => {
  delete req.body._id;
  const sauceObject = JSON.parse(req.body.sauce);
  const sauce = new Sauce({
    ...sauceObject,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Nouvelle sauce, attention ça chauffe !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Recette modifiée ;)'}))
    .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce digérée !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

exports.likeSauce = (req, res, next) => {
  const userId = req.body.userId;
  if (req.body.like === 1) {
    Sauce.updateOne({ _id: req.params.id }, {
      $inc: { likes: +1 },
      $push: { usersLiked: userId }
    })
      .then(() => res.status(200).json({ message: 'Elle semble à votre goût !'}))
      .catch(error => res.status(400).json({ error }))
  }
  else if (req.body.like === 0) {
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        if (Object.values(sauce.usersLiked).includes(userId) === true) {
          sauce.likes--;
          let index = sauce.usersLiked.indexOf(userId);
          sauce.usersLiked.splice(index, 1);
        }
        else if (Object.values(sauce.usersDisliked).includes(userId) === true) {
          sauce.dislikes--;
          let index = sauce.usersDisliked.indexOf(userId);
          sauce.usersDisliked.splice(index, 1);
        };
        sauce.save()
      })
      .then(() => res.status(200).json({ message: "C'est noté !"}))
      .catch(error => res.status(400).json({ error }))
  }
  else if (req.body.like === -1) {
    Sauce.updateOne({ _id: req.params.id }, {
      $inc: { dislikes: +1 },
      $push: { usersDisliked: userId }
    })
      .then(() => res.status(200).json({ message: 'Trop épicée ?'}))
      .catch(error => res.status(400).json({ error }))
  }
};