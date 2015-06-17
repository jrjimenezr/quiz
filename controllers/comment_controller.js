//Cargamos el modelo
var models = require('../models/models.js');

//GET /quizes/:quizId/comments/new
exports.new = function(req, res) {
  res.render('comments/new', {quizId: req.params.quizId, errors: {}});
};

//POST /quizes/:quizId/comments
exports.create = function(req, res) {
  var comment = models.Comment.build({
    texto: req.body.comment.texto,
    QuizId: req.params.quizId
  });
  //Guardamos en la BD el texto del comentario
  comment.save().then(function(){
    res.redirect('/quizes/'+req.params.quizId);
  }).catch(function(err) {
    res.render('comments/new', {comment: comment, quizId: req.params.quizId, errors: err});
  });
};