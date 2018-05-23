const bookshelf = require('../config/bookshelf-instance');
const Promise = require('bluebird');
const bcrypt = Promise.promisifyAll(require('bcrypt'));
const securityConfig = require('../config/security-config');
var Classe=require('./classe');
var Unite=require('./unite');






module.exports =bookshelf.Model.extend({
    tableName:'niveau',

  


    classes:function(){

        return this.hasMany(Classe);  
    },

    unites:function(){
        return this.hasMany(Unite);
    }
  


})