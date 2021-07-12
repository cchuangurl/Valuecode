//載入相對應的model
const Parameter = require('../models/index').parameter;
//const Author = require('../models/author');
module.exports = {
    //創建
    create(req, res) {
        var new_parameter = new Parameter(req.body);
    new_parameter.save(function(err, parameter) {
        if (err)
            res.send(err);
        res.redirect("/api/parameter");
    });
    },
    //列表項
    list(req, res) {
        var listreport=req.query.statusreport;
        Parameter.find({},null,{sort: {a15waterno:-1,_id:-1}},function(err, parameter) {
            if (err)
            res.send(err);
            //res.json(parameter);
            res.render("parameter/listpage",{
                statusreport:listreport,
                parameterlist:parameter
            })
        });
    },
    //取得某項
    retrieve(req, res) {
        var editreport=req.body.statusreport;
        Parameter.findById(req.params.id, function(err, parameter) {
            if (err)
                res.send(err);
            //res.json(parameter);
            res.render("parameter/editpage",{
                statusreport:editreport,
                parameter:parameter
            })
        });
    },
     //取得對應號碼之項
     findByNo(req, res) {
        return Parameter.find({a35waterno:req.params.no}, function(err, parameter) {
            if (err)
                res.send(err);
            return parameter
        });
    },
    //更新
    update(req, res) {
        Parameter.findOneAndUpdate({_id:req.params.id}, req.body, { new: true }, function(err, parameter) {
            if (err)
                res.send(err);
            //res.json(parameter);
            res.redirect("/api/parameter");
        });
    },
    //刪除
    destroy(req, res) {
        Parameter.remove({_id: req.params.id}, function(err, parameter) {
        //Parameter.findByIdAndRemove(req.params.id, function(err, parameter) {
            if (err)
                res.send(err);
            //res.json({ message: 'Parameter successfully deleted' });
            res.redirect("/api/parameter");
        });
}
}