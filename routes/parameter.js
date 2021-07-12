var express = require('express');
var router = express.Router();
const parameterController = require('../controllers/index').parameter;
//&nbsp;
/* GET home page. */
router.get('/', function(req, res, next) {
	parameterController.list(req,res)
});
//&nbsp;
router.get('/inputpage', function(req, res, next) {
	res.render("parameter/inputpage",{
		//statusreport:req.body.statusreport
		statusreport:req.query.statusreport
	})
});
//&nbsp;
router.get('/:id', function(req, res, next) {
	parameterController.retrieve(req,res)
});
router.get('/find/:no', function(req, res, next) {
	parameterController.findByNo(req,res)
});
//&nbsp;
router.post('/', function(req, res, next) {
	console.log(req.body);
	parameterController.create(req,res)
});
//&nbsp;
router.get('/delete/:id', function(req, res, next) {
	parameterController.destroy(req,res)
});
//&nbsp;
//&nbsp;
router.post('/update/:id', function(req, res, next) {
	parameterController.update(req,res)
});
//&nbsp;
module.exports = router;