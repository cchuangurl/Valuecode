//載入相對應的model
const Turninfo = require('../models/index').turninfo;
//const Author = require('../models/author');
module.exports = {
    //創建
    create(req, res) {
        var new_turninfo = new Turninfo(req.body);
    new_turninfo.save(function(err, turninfo) {
        if (err)
            res.send(err);
        res.redirect("/api/turninfo");
    });
    },
    //列表項
    list(req, res) {
        var listreport=req.query.statusreport;
        Turninfo.find({},null,{sort: {a35waterno:-1}},function(err, turninfo) {
            if (err)
            res.send(err);
            //res.json(turninfo);
            res.render("turninfo/listpage",{
                statusreport:listreport,
                turninfolist:turninfo
            })
        })
    },
    //取得某項
    retrieve(req, res) {
        var editreport=req.body.statusreport;
        Turninfo.findById(req.params.id, function(err, turninfo) {
            if (err)
                res.send(err);
            //res.json(turninfo);
            res.render("turninfo/editpage",{
                statusreport:editreport,
                turninfo:turninfo
            })
        });
    },
     //取得對應號碼之項
     findByNo(req, res) {
        return Turninfo.find({a35waterno:req.params.no}, function(err, turninfo) {
            if (err)
                res.send(err);
            return turninfo
        });
    },
    //更新
    update(req, res) {
        Turninfo.findOneAndUpdate({_id:req.params.id}, req.body, { new: true }, function(err, turninfo) {
            if (err)
                res.send(err);
            //res.json(turninfo);
            res.redirect("/api/turninfo");
        });
    },
    //刪除
    destroy(req, res) {
        Turninfo.remove({_id: req.params.id}, function(err, turninfo) {
        //Turninfo.findByIdAndRemove(req.params.id, function(err, turninfo) {
            if (err)
                res.send(err);
            //res.json({ message: 'Turninfo successfully deleted' });
            res.redirect("/api/turninfo");
        });
    },
    dobatchInput(req, res) {    
        var statusreport=req.query.statusreport;
        // 引用需要的模組
        const fs = require('fs');
        const path=require("path");
        const readline = require('readline');
        // 逐行讀入檔案資料
        //定義輸出串流
        //var writeStream = fs.createWriteStream('out.csv');

        //定義讀入串流 (檔案置於/public目錄下)
        let filepath=path.join(__dirname,"../public/");
        var lineReader = readline.createInterface({            
            input: fs.createReadStream(filepath+req.query.datafile+'.csv') 
        });
        var firstLine = true;
        var lineno=0;
        var tempstore=new Array(3);
        for (let i=0;i<3;i++){
            tempstore[i]=new Array();    
        };       
                
        lineReader.on('line', function(data) {            
            var values = data.split(',');
            tempstore[0][lineno]=values[0].trim();
            tempstore[1][lineno]=values[1].trim();
            tempstore[2][lineno]=values[2].trim();
            lineno++;
            console.log("read line:"+lineno+data)
            });//EOF lineReader.on
        console.log("reading..."+filepath+req.query.datafile+".csv");
        setTimeout(function(){
            var turninfoArray=new Array(lineno);
            for (let k=0;k<lineno;k++){
            turninfoArray[k]=new Array(3);
            for (let m=0;m<3;m++){
                turninfoArray[k][m]=tempstore[m][k]
            }
            }                        
            console.log("3 second later...");
            console.log("1st datum of turninfoArray:"+turninfoArray[0][0]);
            console.log("read total lines:"+turninfoArray.length);
            let promise1=((arrayj)=>{            
                return new Promise((resolve,reject)=>{
                var new_turninfo = new Turninfo({
                a05sixtype:"weili",
                a10period:arrayj[0],
                a15date: arrayj[1],
                a35waterno:array[2]
                });//EOF new Turninfo
                console.log("for checking item:"+new_turninfo.a35waterno);            
                console.log("Going to save document:"+new_turninfo.a35waterno);
                resolve(new_turninfo);
                reject(new Error())
            })//EOF Promise   
            })//EOF promise1
            let promise2=((turninfo)=>{                
                return new Promise((resolve,reject)=>{
                    turninfo.save(function(err, turninfo) {
                    console.log("Saved document:"+turninfo.a35waterno);
                    resolve();
                    reject(err)                
                    })//EOF .save
                })//EOF Promise .save
            });//EOF promise2
        let sequence=Promise.resolve();
        turninfoArray.forEach(function(array){
            sequence=sequence.then(function(){
                var new_turninfo = new Turninfo({
                    a05sixtype:"weili",
                    a10period:array[0],
                    a15date: array[1],
                    a35waterno:array[2]
                    });//EOF new Turninfo
                return promise2(new_turninfo)
                .catch(err=>{

                })
            })//EOF sequence
            })//EOF forEach           
            },3000);
        setTimeout(function(){          
            res.redirect("/api/turninfo/?statusreport="+statusreport)
        },15000)      
    }//EOF batchInput
}//EOF export