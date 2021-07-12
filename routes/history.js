var express = require('express');
var router = express.Router();
const historyController = require('../controllers/index').history;

//&nbsp;
/* GET home page. */
router.get('/', function(req, res, next) {
	historyController.list(req,res)
});
//&nbsp;
router.get('/getfromweb', function(req, res, next) {
	historyController.webinput(req,res)
	//next()
});
//&nbsp;
router.get('/inputpage', function(req, res, next) {
	res.render("history/inputpage",{
		//statusreport:req.body.statusreport
		statusreport:req.query.statusreport
	})
});
//&nbsp;
router.get('/batchinput', function(req, res, next) {
	historyController.dobatchInput(req,res)
});
//&nbsp;
router.get('/:id', function(req, res, next) {
	historyController.retrieve(req,res)
});
//&nbsp;
router.post('/', function(req, res, next) {
	console.log(req.body);
	historyController.create(req,res)
});
//&nbsp;
router.get('/delete/:id', function(req, res, next) {
	historyController.destroy(req,res)
});
//&nbsp;
//&nbsp;
router.post('/update/:id', function(req, res, next) {
	historyController.update(req,res)
});
//&nbsp;
module.exports = router;