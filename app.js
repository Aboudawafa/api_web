var path = require('path');
var express = require('express');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors=require('cors');
var Actualites=require('./routes/actualites');
var Etudiants=require('./routes/etudiants');
var Classes=require('./routes/classes');
var Matieres=require('./routes/matieres');
var Salles=require('./routes/salles');
var Seances=require('./routes/seances');
var Niveaux=require('./routes/niveaux');
var Notes=require('./routes/notes');
var Annees=require('./routes/annees');
var Unites=require('./routes/unites');
var AbsenceEtudiant=require('./routes/absetudiant');
var Enseignant=require('./routes/enseignants');
const authController = require('./routes/auth-controller');
const passport = require('passport');
const configurePassport = require('./config/passport-jwt-config');
var Absence=require('./routes/absences');
var Absetudiant=require('./routes/absetudiant');
var Seancetudiant=require('./routes/seancetudiant')
var Noteinfos=require('./routes/noteinfos');

var _ = require('lodash');
var express = require('express');
var app = express();
/*app.use(passport.initialize());
app.use(passport.session());
require('./config/passport-jwt-config')(passport);*/
app.use(passport.initialize());
configurePassport();
var bodyParser = require('body-parser');



// application routing
var router = express.Router();
// body-parser middleware for handling request variables
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json()); 

// Add headers
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Pass to next layer of middleware
  next();
});

app.use(cors({origin:'*'}));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/auth', authController);

app.use('/etudiants',Etudiants);
app.use('/classes',Classes);
app.use('/salles',Salles);
app.use('/actualites',Actualites);
app.use('/seances',Seances);
app.use('/noteinfo',Noteinfos);
app.use ('/absences',Absence);
app.use ('/absetudiant',Absetudiant);
app.use ('/seancetudiant',Seancetudiant);

app.use ('/enseignants',Enseignant);
app.use('/niveaux',Niveaux);
app.use('/notes',Notes);
app.use('/annees',Annees);
app.use('/unites',Unites);
app.use('/matieres',Matieres);
app.use('/api/uploads',express.static('uploads'));
app.use('/api/photoEtudiant',express.static('photoEtudiant'));
app.use('/noteinfo/allnotifnotread',Noteinfos);
app.use('/noteinfo/countnotifnotread',Noteinfos);


// catch 404 and forward to error handler
/*app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});*/

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
