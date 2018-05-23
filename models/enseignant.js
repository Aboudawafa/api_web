'use strict'

const bookshelf = require('../config/bookshelf-instance');
const Promise = require('bluebird');
const bcrypt = Promise.promisifyAll(require('bcrypt'));
const securityConfig = require('../config/security-config');
var Seance=require('./seance');

module.exports =bookshelf.Model.extend({
    tableName: 'enseignant',

    seance : function(){
      return this.hasMany(Seance);
     },

  
  })

  