'use strict';

const controller = require('lib/wiring/controller');
const models = require('app/models');
const Example = models.example;

const authenticate = require('./concerns/authenticate');

// Show all of the items in the examples collection. Needs a plural resource. Catches errors and pass along via next() statement (which will render a 404 not found message). Sends a response via the res.json terminal handler.
const index = (req, res, next) => {
  Example.find()
    .then(examples => res.json({ examples }))
    .catch(err => next(err));
};

// Shows a single item from the examples collection. Needs a singular resource. Handles errors same way. Checks for existence so you can handle not-found errors. Id is passed as a parameter on request. Send a response via the res.json terminal handler.
const show = (req, res, next) => {
  Example.findById(req.params.id)
    .then(example => example ? res.json({ example }) : next())
    .catch(err => next(err));
};

// Creates a new item in the examples collection. Singular resource. Data for creating object is passed as part of request.
const create = (req, res, next) => {
  let example = Object.assign(req.body.example, {
    _owner: req.currentUser._id,
  });
  Example.create(example)
    .then(example => res.json({ example }))
    .catch(err => next(err));
};

// Updated an item in the examples collection. Needs a singular resource. Checks existence of example in query, and if not calls next() (which will render a 404 not found message). Uses sendStatus terminal handler.
const update = (req, res, next) => {
  let search = { _id: req.params.id, _owner: req.currentUser._id };
  Example.findOne(search)
    .then(example => {
      if (!example) {
        return next();
      }

      delete req.body._owner;  // disallow owner reassignment.
      return example.update(req.body.example)
        .then(() => res.sendStatus(200));
    })
    .catch(err => next(err));
};

// Removes an item from the examples collection. Uses sendStatus terminal handler.
const destroy = (req, res, next) => {
  let search = { _id: req.params.id, _owner: req.currentUser._id };
  Example.findOne(search)
    .then(example => {
      if (!example) {
        return next();
      }

      return example.remove()
        .then(() => res.sendStatus(200));
    })
    .catch(err => next(err));
};

module.exports = controller({
  index,
  show,
  create,
  update,
  destroy,
}, { before: [
  { method: authenticate, except: ['index', 'show'] },
], });
