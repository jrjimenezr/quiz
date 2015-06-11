//Cargamos el modelo
var models = require('../models/models.js');

//Auotoload
exports.load = function(req, res, next, quizId) {
  models.Quiz.find(quizId).then(
    function(quiz) {
      if (quiz) {
        req.quiz = quiz;
        next();
      }
      else {
        next(new Error('No existe quizId=' + quizId));
      }
    }
  ).catch(function(error) { next(error); });
};

//GET /quizes
exports.index = function(req, res) {
  var busqueda = req.query.search || '';
  busqueda = '%' + busqueda.replace(/\s/g, '%') + '%';
  busqueda = busqueda.toUpperCase();
  models.Quiz.findAll({where: ["upper(pregunta) like ?", busqueda], order: ["pregunta"]}).then(function(quizes) {
    res.render('quizes/index', { quizes: quizes });
  });
};

//GET /quizes/:id
exports.show = function(req, res) {
  models.Quiz.find(req.params.quizId).then(function(quiz){
    res.render('quizes/show', { quiz: req.quiz});
  });
};

//GET /quizes/:id/answer
exports.answer = function(req, res) {
  var resultado = 'Incorrecto';
  if (req.query.respuesta === req.quiz.respuesta) {
    resultado = 'Correcto';
  }
  res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado});
};


//GET /quizes/new
exports.new = function(req, res) {
  var quiz = models.Quiz.build(
    {pregunta: "Pregunta", respuesta: "Respuesta"}
  );
  res.render('quizes/new', {quiz: quiz, errors: {}});
};

//POST /quizes/create
exports.create = function(req, res) {
  var quiz = models.Quiz.build(req.body.quiz);
  //Guardamos en la BD los campos pregunta y respuesta
  /*quiz.validate().then(function(err) {
    if (err) {
      res.render('quizes/new', {quiz: quiz, errors: err.errors});
    }
    else {
      quiz.save({fields: ["pregunta", "respuesta"]}).then(function(){
        res.redirect('/quizes');
      });
    }
  });*/
  quiz.save({fields: ["pregunta", "respuesta"]}).then(function(){
    res.redirect('/quizes');
  }).catch(function(err) {
    res.render('quizes/new', {quiz: quiz, errors: err});
  });
};
