var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('Quiz JR'));
app.use(session());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(partials());

//Chequeo de inactividad
function chequeaInactividad(req, res, next) {
  //Si estamos accediendo a la página de login o logout, borro el tiempo de la sesion
  if (req.path.match(/\/login|\/logout/)) {
    delete req.session.time;
  }
  var ahora = new Date();
  var ultimaActividad = req.session.time ? new Date(req.session.time) : new Date();

  //Sólo lo compruebo cuando hay un usuario validado
  if (req.session.user) {
    //Compruebo si hemos excedido el tiempo de inactividad máximo
    if (ahora - ultimaActividad > 120000) {
      delete req.session.user;
      var errors = {'message': 'Tiempo de inactividad excedido. <br/> Sesión caducada.'};
      req.session.errors = {};
      res.render('sessions/new', {errors: errors});
    }
    else {
      //Actualizo tiempo ultima peticion
      req.session.time = new Date();
      next();
    }
  } else {
    next();
  }
}

// Helpers dinámicos
app.use(function(req, res, next) {
  //Guardamos path en session.redir para despues
  if (!req.path.match(/\/login|\/logout/)) {
    req.session.redir = req.path;
  }
  //Hacemos visible req.session a las vistas
  res.locals.session = req.session;
  next();
});

app.use('/', chequeaInactividad, routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
