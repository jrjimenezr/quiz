var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller')

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' });
});

//GET para answer y question
router.get('/quizes/question', quizController.question);
router.get('/quizes/answer', quizController.answer);

module.exports = router;
