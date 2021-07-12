//載入相對應的model
//const Test = require('../models/index').test;
//const Author = require('../models/author');
module.exports = {
    //創建
    create(req, res) {
        var new_test = new Test(req.body);
    new_test.save(function(err, test) {
        if (err)
            res.send(err);
        res.redirect("/api/test");
    });
    },
    //測試片段程式
    runcode(req, res) {
        let stackno=new Array();
        stackno.push(3);
        console.log("stackno(layer=0):"+stackno);
        stackno[0]=new Array();
        stackno[0].push(2);
        stackno[0].push(1);
        stackno[0].push(4);
        console.log("stackno(layer=0,1):"+stackno);
        console.log("stackno[0](layer=1):"+stackno[0]);
        let shiftstackno=stackno[0];
        console.log("shiftstackno(layer=1):"+shiftstackno);
        shiftstackno[0]=new Array();
        shiftstackno[0].push(5);
        shiftstackno[0].push(6);
        console.log("shiftstackno(layer=2):"+shiftstackno[0]);
        console.log("stackno(layer=1,2):"+stackno[0]);
        console.log("stackno(layer=0,1,2):"+stackno)        
        if (err)
            res.send(err);
        res.redirect("/");
    },
    //列表項
    list(req, res) {
        var listreport=req.query.statusreport;
        Test.find({},null,{sort: {a35waterno:-1}},function(err, test) {
            if (err)
            res.send(err);
            //res.json(test);
            res.render("test/listpage",{
                statusreport:listreport,
                testlist:test
            })
        })
    },
    //取得某項
    retrieve(req, res) {
        var editreport=req.body.statusreport;
        Test.findById(req.params.id, function(err, test) {
            if (err)
                res.send(err);
            //res.json(test);
            res.render("test/editpage",{
                statusreport:editreport,
                test:test
            })
        });
    },
     //取得對應號碼之項
     findByNo(req, res) {
        return Test.find({a35waterno:req.params.no}, function(err, test) {
            if (err)
                res.send(err);
            return test
        });
    },
    //更新
    update(req, res) {
        Test.findOneAndUpdate({_id:req.params.id}, req.body, { new: true }, function(err, test) {
            if (err)
                res.send(err);
            //res.json(test);
            res.redirect("/api/test");
        });
    },
    //刪除
    destroy(req, res) {
        Test.remove({_id: req.params.id}, function(err, test) {
        //Test.findByIdAndRemove(req.params.id, function(err, test) {
            if (err)
                res.send(err);
            //res.json({ message: 'Test successfully deleted' });
            res.redirect("/api/test");
        });
    },
}//EOF export