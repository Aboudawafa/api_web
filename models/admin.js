const bookshelf = require('../config/bookshelf-instance');
const Promise = require('bluebird');
const bcrypt = Promise.promisifyAll(require('bcrypt'));
const securityConfig = require('../config/security-config');
var Actualite=require('./actualite');

module.exports=bookshelf.Model.extend({
    tableName:'admin',

    admin:function(){
        return this.hasMany(Actualite); 
     }
    })
