var express = require('express');
var router = express.Router();
const guessController = require('../controllers/index').guess_middle;
//&nbsp;
/* GET home page. */
router.get('/', function(req, res, next) {
	guessController.list(req,res)
});
//&nbsp;
router.get('/calc_middle', function(req, res, next) {
	guessController.docalc_middle(req,res)
});
//&nbsp;
router.get('/inputpage', function(req, res, next) {
	res.render("guess/inputpage",{
		//statusreport:req.body.statusreport
		statusreport:req.query.statusreport
	})
});
//&nbsp;
router.get('/:id', function(req, res, next) {
	guessController.retrieve(req,res)
});
router.get('/find/:no', function(req, res, next) {
	guessController.findByNo(req,res)
});
//&nbsp;
router.post('/', function(req, res, next) {
	console.log(req.body);
	guessController.create(req,res)
});
//&nbsp;
router.get('/delete/:id', function(req, res, next) {
	guessController.destroy(req,res)
});
//&nbsp;
//&nbsp;
router.post('/update/:id', function(req, res, next) {
	guessController.update(req,res)
});
//&nbsp;
module.exports = router;