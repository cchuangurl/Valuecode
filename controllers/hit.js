//載入相對應的model
const Hit = require('../models/index').hit;
const Guess = require('../models/index').guess;
const History = require('../models/index').history;
//const Author = require('../models/author');
module.exports = {
    //指定期別後轉去對單期獎    
    checkout(req, res) {
        //res.setHeader('Content-Type', 'application/json');
       var checkno=req.query.assign;
       console.log(checkno);
        //const checkno=1357;
        var statusreport=req.query.statusreport;
        let history=new Array(7);
        let punch1, punch2;
        let promise1=((checkno)=>{
            return new Promise((resolve,reject)=>{
            return History.findOne({a10waterno:checkno}, function(err, thisturn) {        		
                history[0]=thisturn.a15code1;
                history[1]=thisturn.a20code2;
                history[2]=thisturn.a25code3;
                history[3]=thisturn.a30code4;
                history[4]=thisturn.a35code5;
                history[5]=thisturn.a40code6;
                history[6]=thisturn.a45extracode;
                console.log("get history:"+checkno+"->"+history);
                resolve(checkno)
            })//EOF findOne
        })//EOF return Promise 
        });//EOF Promise1
        let promise2=((checkno)=>{
            let ans_set;
            return new Promise((resolve,reject)=>{
            Guess.find({a15waterno:checkno}, function(err, guesslist) {
                console.log("found guess of:"+checkno+"->"+guesslist.length);                
                for(let guess of guesslist) {
                    let outcome=new Array(8);
                    punch1=0;
                    punch2=0;
                    outcome[0]=guess.a20guess1;
                    outcome[1]=guess.a25guess2;
                    outcome[2]=guess.a30guess3;
                    outcome[3]=guess.a35guess4;
                    outcome[4]=guess.a40guess5;
                    outcome[5]=guess.a45guess6;
                    outcome[6]=guess.a50guessextra;
                    ans_set=guess.a10ans_set;
                    console.log("processing guess ->"+outcome)
                    for(let i=0;i<6;i++) {
                        for(let j=0;j<6;j++) {
                            if(outcome[i]===history[j]) {
                                punch1=punch1+1;
                                }
                        }//EOF for j
                                                
                        }//EOF for i
                        if(outcome[6]===history[6]) {
                            punch1=punch1+1.5;                                
                        }
                    if(punch1>=2.4) {
                        punch2=punch1;
                    }else {
                        punch2=0;
                    }
                    console.log("hit of set:"+punch2)
                    let new_hit=new Hit({
                        a05guess_ids:guess._id,
                        a10waterno:guess.a15waterno,
                        a15no_hit:punch1,
                        a20effect_hit:punch2,
                        a25ans_set:ans_set
                    })//EOF new_hit                    
                    let sequence=Promise.resolve();                
                    sequence=sequence.then(()=>{
                    return promise3(new_hit).then()
                    .catch(err=>{
                        console.log(err)
                    })
                        })//EOF sequence
                    }//EOF forEach
            })//EOF find            
            resolve()
            })//EOF return Promise            
            });//EOF promise2
        let promise3=((new_hit)=>{
            return new Promise((resolve,reject)=>{            
            new_hit.save(function(err, hit) {
                console.log("saved:"+hit)    
            })//EOF save
            resolve()
            })//EOF return Promise
            });//EOF promise3
        promise1(checkno)
        .then((checkno)=>{
            promise2(checkno); 
        })
        .catch(err=>{
            console.log(err)
        })
        setTimeout(()=>{
            res.redirect("/api/hit/?statusreport="+statusreport)
            //res.end()
        },3000)                      
    },//EOF checkout
    //創建 
    create(req, res) {
        var new_hit = new Hit(req.body);
        let statusreport=req.query.statusreport;
        new_hit.save(function(err, hit) {
        if (err)
            res.send(err);
        res.redirect("/api/hit/?statusreport="+statusreport);
    });
    },
    //列表項
    list(req, res) {
        var listreport=req.query.statusreport;
        Hit.find({},null,{sort: {a10waterno:-1,a05guess_ids:-1,a25ans_set:1}},function(err, hitlist) {
            if (err)
            res.send(err);
            //res.json(hit);
            res.render("hit/listpage",{
                statusreport:listreport,
                hitlist:hitlist
            })
        });
    },
    //取得某項
    retrieve(req, res) {
        var editreport=req.body.statusreport;
        Hit.findById(req.params.id, function(err, hit) {
            if (err)
                res.send(err);
            //res.json(hit);
            res.render("hit/editpage",{
                statusreport:editreport,
                hit:hit
            })
        });
    },
     //取得對應號碼之項
     findByNo(req, res) {
        return Hit.find({a35waterno:req.params.no}, function(err, hit) {
            if (err)
                res.send(err);
            return hit
        });
    },
    //更新
    update(req, res) {
        Hit.findOneAndUpdate({_id:req.params.id}, req.body, { new: true }, function(err, hit) {
            if (err)
                res.send(err);
            //res.json(hit);
            res.redirect("/api/hit");
        });
    },
    //刪除
    destroy(req, res) {
        Hit.remove({_id: req.params.id}, function(err, hit) {
        //Hit.findByIdAndRemove(req.params.id, function(err, hit) {
            if (err)
                res.send(err);
            //res.json({ message: 'Hit successfully deleted' });
            res.redirect("/api/hit");
        });
}
}