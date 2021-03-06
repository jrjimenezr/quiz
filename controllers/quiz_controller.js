//Cargamos el modelo
var models = require('../models/models.js');

//Auotoload
exports.load = function(req, res, next, quizId) {
  models.Quiz.find({
    where: { id: Number(quizId)},
    include: [{model: models.Comment}]
  }).then(
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
  res.render('quizes/show', { quiz: req.quiz});
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
    {pregunta: "Pregunta", respuesta: "Respuesta", tematica: "Otra"}
  );
  res.render('quizes/new', {quiz: quiz, errors: {}});
};

//POST /quizes/create
exports.create = function(req, res) {
  var quiz = models.Quiz.build(req.body.quiz);
  //Guardamos en la BD los campos pregunta y respuesta
  quiz.save({fields: ["pregunta", "respuesta", "tematica"]}).then(function(){
    res.redirect('/quizes');
  }).catch(function(err) {
    res.render('quizes/new', {quiz: quiz, errors: err});
  });
};

//GET /quizes/:id/edit
exports.edit = function(req, res) {
  res.render('quizes/edit', { quiz: req.quiz, errors: {}});
}

//PUT /quizes/:id
exports.update = function(req, res) {
  req.quiz.pregunta = req.body.quiz.pregunta;
  req.quiz.respuesta = req.body.quiz.respuesta;
  req.quiz.tematica = req.body.quiz.tematica;
  //Guardamos en la BD los campos pregunta y respuesta
  req.quiz.save({fields: ["pregunta", "respuesta", "tematica"]}).then(function(){
    res.redirect('/quizes');
  }).catch(function(err) {
    res.render('quizes/edit', {quiz: req.quiz, errors: err});
  });
};

//DELETE /quizes/:id
exports.destroy = function(req, res) {
  req.quiz.destroy().then( function() {
    res.redirect('/quizes');
  }).catch(function(error) {next(error)});
}
