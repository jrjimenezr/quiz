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
  models.Quiz.findAll({where: ["pregunta like ?", busqueda]}).then(function(quizes) {
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
