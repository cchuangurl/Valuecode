var express = require('express');
var router = express.Router();
const hitController = require('../controllers/index').hit;
//&nbsp;
/* GET home page. */
router.get('/', function(req, res, next) {
	hitController.list(req,res)
});
//&nbsp;
router.get('/checkassign', function(req, res, next) {
	hitController.checkout(req,res)
});
//&nbsp;
router.get('/:id', function(req, res, next) {
	hitController.retrieve(req,res)
});
router.get('/find/:no', function(req, res, next) {
	hitController.findByNo(req,res)
});
//&nbsp;
router.post('/', function(req, res, next) {
	console.log(req.body);
	hitController.create(req,res)
});
//&nbsp;
router.get('/delete/:id', function(req, res, next) {
	hitController.destroy(req,res)
});
//&nbsp;

router.post('/update/:id', function(req, res, next) {
	hitController.update(req,res)
});

//&nbsp;
module.exports = router;