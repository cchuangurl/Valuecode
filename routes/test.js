var express = require('express');
var router = express.Router();
const testController = require('../controllers/index').test;
//&nbsp;
router.get('/', function(req, res, next) {
	testController.list(req,res)
});
//&nbsp;
router.get('/partcode', function(req, res, next) {
	testController.runcode(req,res)
});
//&nbsp;
router.get('/:id', function(req, res, next) {
	testController.retrieve(req,res)
});
router.get('/find/:no', function(req, res, next) {
	testController.findByNo(req,res)
});
//&nbsp;
router.post('/', function(req, res, next) {
	console.log(req.body);
	testController.create(req,res)
});
//&nbsp;
router.get('/delete/:id', function(req, res, next) {
	testController.destroy(req,res)
});
//&nbsp;
//&nbsp;
router.post('/update/:id', function(req, res, next) {
	testController.update(req,res)
});
//&nbsp;
module.exports = router;
