'use strict'

var express = require('express');
var router = express.Router();
const bookshelf = require('../config/bookshelf-instance');
const securityConfig = require('../config/security-config');
const bcrypt=require('bcrypt')
var Etudiant=require('../models/etudiant')
var Classe=require('../models/classe')
const passport = require('passport');
var multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
     cb(null, './photoEtudiant/');
    },
   filename: function(req, file, cb) {
     cb(null, new Date().toISOString() + file.originalname);
   }
  });

  const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(null, false);
    }
   };
  const upload = multer({
    storage: storage,
    limits: {
    fileSize: 1024 * 1024 * 5
     },
     fileFilter: fileFilter
    });




var Etudiants = bookshelf.Collection.extend({
  model: Etudiant
});

router.get('/securedArea', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({msg: "You made it to the secure area"});
});

router.route('/')
// fetch all users
 /*  .get(/*(passport.authenticate('jwt', { session: false })function (req, res) {
      Etudiants.forge()
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
  }) */
 
  .get(function (req, res) {
    Etudiants.forge()
  .fetch()
  .then(function (collection) {
    var result = [];
      var counter = 0;
      collection.toJSON().forEach((element, idx) => {
        result.push(element);
        Classe.forge({id: element.id_classe})
        .fetch()
        .then(function (classe) {
          if (!classe) {
            result[idx].classe = {}
                     counter = counter + 1;
          }
          else {
            result[idx].classe = classe.toJSON();
                   console.log(result);
                   counter = counter + 1;
          
                  }
                  if (counter === collection.toJSON().length) {
                    res.json({
                      error: false,
                      data: result
                    });
                   }
                  })
        
        .catch(function (err) {
          res.status(500).json({error: true, data: {message: err.message}});
        });
      
      })
  
  })
  .catch(function (err) {
    console.log(err)
    res.status(500).json({error: true, data: {message: err.message}});
  });
  })



  .post(upload.single('photo'),function (req, res) {
    bcrypt.hash(req.body.password, 10, (err,hash)=> {
      console.log(hash)
      Etudiant.forge({
        "firstName":req.body.firstName,
        "lastName":req.body.lastName,
        "cin":req.body.cin,
        "date_naissance":req.body.date_naissance,
        "email":req.body.email,
        "password":hash,
        "username":req.body.username,
        "id_classe":req.body.classe,
        "photo":req.file.path,
      })
      .save()
      .then(function (user) {
        res.json({error: false, data: {id: user.get('id')}});
      })
      .catch(function (err) {
        res.status(500).json({error: true, data: {message: err.message}});
      }); 
    });
    
  });
router.route('/:id')
  // fetch user
  .get(function (req, res) {
    Etudiant.forge({id: req.params.id})
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
    Etudiant.forge({id: req.params.id})
    .fetch({require: true})
    .then(function (etudiant) {
      etudiant.save({
        "firstName":req.body.firstName || etudiant.get('firstName'),
        "lastName":req.body.lastName || etudiant.get('lastName'),
        "cin":req.body.cin || etudiant.get('cin'),
        "date_naissance":req.body.date_naissance|| etudiant.get('date_naissance'),
        "email":req.body.email || etudiant.get('email'),
        "password":req.body.password || etudiant.get('password'),
        "username":req.body.username || etudiant.get('username'),
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
    Etudiant.forge({id: req.params.id})
    .fetch({require: true})
    .then(function (etudiant) {
      etudiant.destroy()
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