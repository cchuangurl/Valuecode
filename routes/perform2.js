var express = require('express');
var router = express.Router();
const performController = require('../controllers/index').perform2;
//&nbsp;
/* GET home page. */
router.get('/', function(req, res, next) {
	performController.list(req,res)
});
//&nbsp;
router.get('/inputpage', function(req, res, next) {
	res.render("perform/inputpage",{
		//statusreport:req.body.statusreport
		statusreport:req.query.statusreport
	})
});
//&nbsp;
router.get('/batchinput', function(req, res, next) {
	performController.dobatchInput(req,res)
});
//&nbsp;
router.get('/:id', function(req, res, next) {
	performController.retrieve(req,res)
});
router.get('/find/:no', function(req, res, next) {
	performController.findByNo(req,res)
});
//&nbsp;
router.post('/', function(req, res, next) {
	console.log(req.body);
	performController.create(req,res)
});
//&nbsp;
router.get('/delete/:id', function(req, res, next) {
	performController.destroy(req,res)
});
//&nbsp;
//&nbsp;
router.post('/update/:id', function(req, res, next) {
	performController.update(req,res)
});
//&nbsp;
module.exports = router;