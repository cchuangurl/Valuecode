var express = require('express');
var router = express.Router();
const turninfoController = require('../controllers/index').turninfo;
//&nbsp;
/* GET home page. */
router.get('/', function(req, res, next) {
	turninfoController.list(req,res)
});
//&nbsp;
router.get('/inputpage', function(req, res, next) {
	res.render("turninfo/inputpage",{
		//statusreport:req.body.statusreport
		statusreport:req.query.statusreport
	})
});
//&nbsp;
router.get('/:id', function(req, res, next) {
	turninfoController.retrieve(req,res)
});
router.get('/find/:no', function(req, res, next) {
	turninfoController.findByNo(req,res)
});
//&nbsp;
router.post('/', function(req, res, next) {
	console.log(req.body);
	turninfoController.create(req,res)
});
//&nbsp;
router.get('/delete/:id', function(req, res, next) {
	turninfoController.destroy(req,res)
});
//&nbsp;
//&nbsp;
router.post('/update/:id', function(req, res, next) {
	turninfoController.update(req,res)
});
//&nbsp;
module.exports = router;
