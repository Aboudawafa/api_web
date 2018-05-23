'use strict'

var express = require('express');
var router = express.Router();
const bookshelf = require('../config/bookshelf-instance');
const securityConfig = require('../config/security-config');

var Enseignant=require('../models/enseignant')

var Enseignants = bookshelf.Collection.extend({
  model: Enseignant
});

router.route('/')
// fetch all users
  .get(function (req, res) {
    Enseignants.forge()
    .fetch()
    .then(function (collection) {
      collection.toJSON().forEach(element => {
        console.log(element.firstName);
        
      });
      res.json({error: false, data: collection.toJSON()});
      console.log(true);

    })
    .catch(function (err) {
      console.log(err)
      res.status(500).json({error: true, data: {message: err.message}});
    });
  })
  // create a user
  .post(function (req, res) {
    Enseignant.forge({
      "firstName":req.body.firstName,
      "lastName":req.body.lastName,
      "cin":req.body.cin,
      "date_naissance":req.body.date_naissance,
      "email":req.body.email,
      "password":req.body.password,
      "username":req.body.username,
    })
    .save()
    .then(function (user) {
      res.json({error: false, data: {id: user.get('id')}});
    })
    .catch(function (err) {
      res.status(500).json({error: true, data: {message: err.message}});
    }); 
  });
router.route('/:id')
  // fetch user
  .get(function (req, res) {
    Enseignant.forge({id: req.params.id})
    .fetch()
    .then(function (user) {
      if (!user) {
        res.status(404).json({error: true, data: {}});
      }
      else {
        res.json({error: false, data: user.toJSON()});
      }
    })
    .catch(function (err) {
      res.status(500).json({error: true, data: {message: err.message}});
    });
  })
  // update user details
  .put(function (req, res) {
    Enseignant.forge({id: req.params.id})
    .fetch({require: true})
    .then(function (enseignant) {
        enseignant.save({
        "firstName":req.body.firstName || enseignant.get('firstName'),
        "lastName":req.body.lastName || enseignant.get('lastName'),
        "cin":req.body.cin || enseignant.get('cin'),
        "date_naissance":req.body.date_naissance|| enseignant.get('date_naissance'),
        "email":req.body.email || enseignant.get('email'),
        "password":req.body.password || enseignant.get('password'),
        "username":req.body.username || enseignant.get('username'),
      })
      .then(function () {
        res.json({error: false, data: {message: 'User details updated'}});
      })
      .catch(function (err) {
        res.status(500).json({error: true, data: {message: err.message}});
      });
    })
    .catch(function (err) {
      res.status(500).json({error: true, data: {message: err.message}});
    });
  })
  // delete a user
  .delete(function (req, res) {
    Enseignant.forge({id: req.params.id})
    .fetch({require: true})
    .then(function (enseignant) {
      enseignant.destroy()
      .then(function () {
        res.json({error: true, data: {message: 'User successfully deleted'}});
      })
      .catch(function (err) {
        res.status(500).json({error: true, data: {message: err.message}});
      });
    })
    .catch(function (err) {
      res.status(500).json({error: true, data: {message: err.message}});
    });
  });
  module.exports = router;
