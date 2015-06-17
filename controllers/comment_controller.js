//Cargamos el modelo
var models = require('../models/models.js');

//Auotoload
exports.load = function(req, res, next, commentId) {
  models.Comment.find({
    where: { id: Number(commentId)}
  }).then(
    function(comment) {
      if (comment) {
        req.comment = comment;
        next();
      }
      else {
        next(new Error('No existe commentId=' + commentId));
      }
    }
  ).catch(function(error) { next(error); });
};

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

//GET /quizes/:quizId/comments/:commentId/publish
exports.publish = function(req, res) {
  req.comment.publicado = true;

  //Guardamos en la BD el texto del comentario
  req.comment.save({fields: ["publicado"]}).then(function(){
    res.redirect('/quizes/'+req.params.quizId);
  }).catch(function(err) {
    next(err);
  });
};
