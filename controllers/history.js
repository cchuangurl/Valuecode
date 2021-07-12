//載入相對應的model
const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const History = require('../models/index').history;
const Turninfo = require('../models/index').turninfo;
//const Author = require('../models/author');
module.exports = {
    //創建
    create(req, res) {
        //let turninfo=Turninfo.find({a35waterno:req.body.a10waterno},{_id:{$slice: 1}});
        //let turninfo=Turninfo.find({a35waterno:req.body.a10waterno});        
        //console.log(turninfo);
        let turninfo_ids;
        var new_history = new History(req.body); 
            Turninfo.find({a35waterno:req.body.a10waterno}, function(err,turninfo) {
                    return new Promise((resolve,reject)=>{
                    turninfo_ids=turninfo[0]._id;
                    console.log(turninfo_ids);
                    new_history.a05turninfo_ids=turninfo_ids;
                    console.log("new_history.a05turninfo_ids:"+new_history.a05turninfo_ids);
                    console.log("Going to save!");
                    return do_create(new_history)
                    })//EOF Promise
            });//EOF .find 
            let do_create= (history) => {
                new_history.save(function(err, history) {
                if (err)
                res.send(err);                       
                res.redirect("/api/history")        
            });//EOF .save
        }//EOF do_creade             
    },//EOF create
    //從網路擷取一筆
    webinput(req, res) {
        var statusreport=req.query.statusreport;
        let newwaterno, newturnno, newturndate;
        let newcode=new Array();
        let promise1=(()=>{
            return new Promise((resolve,reject)=>{
            History.find({}, function(err,historylist) {           
            newwaterno=historylist.length+1;
            console.log("new waterno:"+newwaterno);
            resolve()
            reject(new Error())
            })//EOF .find            
        })//EOF Promise
        })//EOF promise1
        let promise2=(()=>{
            console.log("processing request...")
            return new Promise((resolve,reject)=>{    
            request({
            url: "https://www.taiwanlottery.com.tw/result_all.aspx#01", //  最新結果page
            method: "GET"
            }, function (error, response, body) {
              if (error || !body) {
              return;
            }            
            console.log("connected to the webpage!");
            const $ = cheerio.load(body); // 載入 body
            const result = []; // 建立一個儲存結果的容器
            const getno=$("#SL638DrawTerm_new").text();
            const getdate=$("#SL638DDate_new").text();
            const gettable= $(".tableWin:first")
            const table_td= $("td:last","tr:last",gettable); // 爬最外層的 Table(class=tableWin) 中的 td
            const getcode=$("span",table_td).each(function(i, elem) {
                newcode[i] = $(this).text();
              });        
            //for (let i = 1; i < table_td.length; i++) { // 走訪 tr
              
              // 建立物件並(push)存入結果
              //result.push(Object.assign({ time, latitude, longitude, amgnitude, depth, location, url }));
            //}
            // 在終端機(console)列出結果
            let index1=getdate.indexOf("年",0);
            let index2=getdate.indexOf("月",0);
            let index3=getdate.indexOf("日",0);
            let newturnyear=1991+parseInt(getdate.substring(0,index1));
            newturnno=getno.trim().substr(0,3)+getno.trim().substr(6,3);            
            newturndate=newturnyear+"/"+getdate.substring(index1+2,index2).trim()+"/"+getdate.substring(index2+2,index3).trim();
            console.log("get turn no:"+newturnno);
            console.log("get code 6:"+newcode[6]);
            console.log("new turn date:"+newturndate)
            
            
            resolve();
            reject(new Error())
            }//EOF function　(error, response, body)
            )//EOF request
            })//EOF Promise
            })//EOF promise2
        let promise3=(()=>{
                console.log("processing save turninfo...")
                return new Promise((resolve,reject)=>{
                    var new_turninfo = new Turninfo({
                        a05sixtype:"weili",
                        a10period:newturnno,
                        a15date:newturndate,
                        a35waterno:newwaterno
                        });
                new_turninfo.save(function(err, turninfo) {        
                
            resolve(turninfo);
            reject(new Error())
            });//EOF new_turninfo.save            
            })//EOF Promise
            })//EOF promise3                
        let promise4=((turninfo)=>{
            console.log("processing save history...")
            return new Promise((resolve,reject)=>{
                var new_history = new History({
                    a05turninfo_ids:turninfo._id,
                    a10waterno:newwaterno,
                    a15code1:newcode[0],
                    a20code2:newcode[1],
                    a25code3:newcode[2],
                    a30code4:newcode[3],
                    a35code5:newcode[4],
                    a40code6:newcode[5],
                    a45extracode:newcode[6]
                })   
            new_history.save(function(err, turninfo) {
                resolve();
                reject(new Error())
            });//EOF new_history.save            
            })//EOF Promise
            })//EOF promise4
        promise1()
        .then(()=>{
            return promise2()
        })
        .then(()=>{
            return promise3()
        })
        .then((turninfo)=>{
            return promise4(turninfo)
        })
        .catch(err=>{
            console.log(err)
        })
        setTimeout(()=>{
            res.redirect("/api/history/?statusreport="+statusreport)
            //res.end()
        },5000)
    },//EOF webinput
    //列表項
    list(req, res) {
        var listreport=req.query.statusreport;
        History.find({},null,{sort: {a10waterno:-1}}, function(err, history) {
            if (err)
            res.send(err);
            //res.json(history);
            res.render("history/listpage",{
                statusreport:listreport,
                historylist:history
            });
            //res.end()
        });
    },
    //取得某項
    retrieve(req, res) {
        var editreport=req.body.statusreport;
        History.findById(req.params.id, function(err, history) {
            if (err)
                res.send(err);
            //res.json(history);
            res.render("history/editpage",{
                statusreport:editreport,
                history:history
            })
        });
    },
    //更新
    update(req, res) {
        History.findOneAndUpdate({_id:req.params.id}, req.body, { new: true }, function(err, history) {
            if (err)
                res.send(err);
            //res.json(history);
            res.redirect("/api/history");
        });
    },
    //刪除
    destroy(req, res) {
        History.remove({_id: req.params.id}, function(err, history) {
        //History.findByIdAndRemove(req.params.id, function(err, history) {
            if (err)
                res.send(err);
            //res.json({ message: 'History successfully deleted' });
            res.redirect("/api/history");
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
    var tempstore=new Array(8);
    for (let i=0;i<8;i++){
        tempstore[i]=new Array(); 
    };       
    //當讀入一行資料時
    lineReader.on('line', function(data) {            
        var values = data.split(',');
        tempstore[0][lineno]=values[0].trim();
        tempstore[1][lineno]=values[1].trim();
        tempstore[2][lineno]=values[2].trim();
        tempstore[3][lineno]=values[3].trim();
        tempstore[4][lineno]=values[4].trim();
        tempstore[5][lineno]=values[5].trim();
        tempstore[6][lineno]=values[6].trim();
        tempstore[7][lineno]=values[7].trim();
        lineno++;
        console.log("read line:"+data)
    });//EOF lineReader.on            
    console.log("reading..."+filepath+req.query.datafile+".csv");    
    setTimeout(function(){
        var historyArray=new Array(lineno);
        for (let k=0;k<lineno;k++){
            historyArray[k]=new Array(8);
            for (let m=0;m<8;m++){
                historyArray[k][m]=tempstore[m][k]
                //console.log(historyArray[k])
            }
        }
        console.log("3 second later...");
        console.log("1st datum of historyArray:"+historyArray[0][0]);
        console.log("read total lines:"+historyArray.length);
        let turninfo_ids;
        let promise1=((arrayj)=>{            
                return new Promise((resolve,reject)=>{
                    Turninfo.find({a35waterno:arrayj[0]}, function(err,turninfo) {
                        turninfo_ids=turninfo[0]._id;
                        console.log("new_history.a05turninfo_ids:"+arrayj[0]+"->"+turninfo_ids);
                        var new_history = new History({
                            a05turninfo_ids:turninfo_ids,
                            a10waterno:arrayj[0],
                            a15code1:arrayj[1],
                            a20code2:arrayj[2],
                            a25code3:arrayj[3],
                            a30code4:arrayj[4],
                            a35code5:arrayj[5],
                            a40code6:arrayj[6],
                            a45extracode:arrayj[7]
                        });//EOF new hustory            
                        console.log("for checking item:"+new_history.a05turninfo_ids);    
                        console.log("Going to save document:"+new_history.a10waterno);                         
                        resolve(new_history);
                        reject(new Error())
                    })//EOF .find
                })//EOF Promise in .find
        });//EOF promise1
        let promise2=((history)=>{                
                return new Promise((resolve,reject)=>{
                    history.save(function(err, history) {
                    console.log("Saved document:"+history.a10waterno);
                    resolve();
                    reject(new Error())                
                    })//EOF .save
                })//EOF Promise .save
        });//EOF promise2
        let sequence=Promise.resolve();
        historyArray.forEach(function(array){
            sequence=sequence.then(function(){
                return promise1(array).then(new_history=>{
                    promise2(new_history)
                })
                .catch(err=>{
                    console.log(err)
                })
            })//EOF sequence
            })//EOF forEach                                            
        },3000);//EOF setTimeOut middle
    setTimeout(()=>{
        res.redirect("/api/history/?statusreport="+statusreport)
    },20000)
        
    }//EOF batchInput
}//EOF export