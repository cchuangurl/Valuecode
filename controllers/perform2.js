//載入相對應的model
const Parameter = require('../models/index').parameter;
const Guess = require('../models/index').guess;
const Hit = require('../models/index').hit;
const Perform2 = require('../models/index').perform2;
//const History = require('../models/index').history;
//const Author = require('../models/author');
module.exports = {
    //績效列表項
    list(req, res) {
        var listreport=req.query.statusreport;
        var performlist=new Array();
        let guess_select=new Array();
        let para_select=new Array();
        let hit_select=new Array();
        let promise1=(()=>{
            return new Promise((resolve,reject)=>{
                Parameter.find({}, function(err, paralist) {
                    if (err)
                    res.send(err);
                //for(let j=0;j<guess_part.length;j++){
                    //console.log("check guess_part "+j+":"+guess_part[j].a05parameter_ids);
                    for(let para of paralist){
                        //console.log("check para  "+j+":"+para._id);
                        //if(para._id.toString()==guess_part[j].a05parameter_ids.toString()){
                        if(para.a25method1===3&&para.a30method2===3&&para.a35method3===3){
                            para_select.push(para)
                        }
                    }                
                //}//EOF for j
                //return para_select;
                console.log("check para_select :"+para_select.length);           
                resolve()    
        })//EOF find
        })//EOF new Promise
        });//EOF promise1
        let promise2=(()=>{
            return new Promise((resolve,reject)=>{
                Guess.find({},null,{sort: {a15waterno:1,a05parameter_ids:1,a30ans_set:1}}, function(err, guesslist) {
                    if (err)
                    res.send(err);
                //guesslist.splice(0,48);//delete first 48 incomplete turns
                //let turn=0;
                //let CN1=18;
                //for(let i=0;i<guesslist.length;i++){
                    //if(i%6===2||i%6===3||i%6===4){
                    //if(i%6===2||i%6===3){
                    //if(turn*CN1+5<i&&i<turn*CN1+12){ 
                        //guess_select.push(guesslist[i])
                    //}
                    /* if((i+1)%CN1===0){
                        turn=turn+1
                    } */
                    guesslist.splice(0,66);//刪掉未有a05parameter_ids的guess
                    console.log("check guesslist length:"+guesslist.length);
                    console.log("check para_select again:"+para_select.length);
                    
                    for(let para of para_select){
                        for(let guess of guesslist){
                            if(guess.a05parameter_ids.toString()===para._id.toString()){
                                guess_select.push(guess);                        
                            }
                        }
                    }
                console.log("check guess_select length:"+guess_select.length);
                resolve()
                })//EOF find        
    })//EOF new Promise
    });//EOF promise2
    
    let promise3=(()=>{
        return new Promise((resolve,reject)=>{
            Hit.find({}, function(err, hitlist) {
                if (err)
                res.send(err);
                console.log("check hitlist:"+hitlist.length);
                console.log("check guess_select length again:"+guess_select.length)        
            for(let guess of guess_select){
                for(let hit of hitlist){
                    //console.log("check hit :"+hit.a05guess_ids); 
                    if(hit.a05guess_ids.toString()===guess._id.toString()){
                        hit_select.push(hit);
                    }
                }//EOF for hit
                console.log("check hit_select:"+hit_select.length);                
            }//EOF for hit           
            let hittime=1, hitsum=0, awardsum=0, hitmean=0, progress=0, lasthitmean=0;               
                for(let hit of hit_select){
                let award=0;                                
                switch(hit.a15no_hit){
                    case 2.5:award=-100+100;break;
                    case 3:award=-100+100;break;
                    case 3.5:award=-100+200;break;
                    case 4:award=-100+800;break;
                    case 4.5:award=-100+400;break;                  
                    case 5:award=-100+20000;break;
                    case 5.5:award=-100+4000;break;
                    case 6:award=-100+8000000;break;
                    case 6.5:award=-100+15000000;break;
                    case 7.5:award=-100+100000000;break;
                    default:award=-100
                }
                lasthitmean=hitsum/hittime;
                hitsum=hitsum+hit.a15no_hit;
                hitmean=hitsum/hittime;
                awardsum=awardsum+award;
                if(lasthitmean===0){
                    progress=0.1
                }else{
                progress=((hitmean-lasthitmean)/lasthitmean)*100
                }
                hittime=hittime+1;
                let perform_new=new Perform2({
                    a10waterno:hit.a10waterno,
                    a15sw1:3,
                    a20sw2:3,
                    a25sw3:3,
                    a30ans_set:hit.a25ans_set,
                    a35hit:hit.a15no_hit,
                    a40effecthit:hit.a20effect_hit,
                    a45hitmean:hitmean,
                    a45expectaward:awardsum,
                })
                performlist.push(perform_new)
            }//EOF for hit
            })//EOF Hit.find
        resolve()
    })//EOF new Promise
    });//EOF promise3      
        //res.json(perform);
    
        promise1()
        .then(()=>{
            return promise2()
            })
        .then(()=>{
             return promise3()
            })      
        .catch(err=>{
            console.log(err)
        })
        setTimeout(()=>{
            res.render("perform/listpage",{
                statusreport:listreport,
                performlist:performlist
            })
        },3000)         
    },//EOF list
    //取得某項
    retrieve(req, res) {
        var editreport=req.body.statusreport;
        Perform.findById(req.params.id, function(err, perform) {
            if (err)
                res.send(err);
            //res.json(perform);
            res.render("perform/editpage",{
                statusreport:editreport,
                perform:perform
            })
        });
    },
     //取得對應號碼之項
     findByNo(req, res) {
        return Perform.find({a35waterno:req.params.no}, function(err, perform) {
            if (err)
                res.send(err);
            return perform
        });
    },
    //更新
    update(req, res) {
        Perform.findOneAndUpdate({_id:req.params.id}, req.body, { new: true }, function(err, perform) {
            if (err)
                res.send(err);
            //res.json(perform);
            res.redirect("/api/perform");
        });
    },
    //刪除
    destroy(req, res) {
        Perform.remove({_id: req.params.id}, function(err, perform) {
        //Perform.findByIdAndRemove(req.params.id, function(err, perform) {
            if (err)
                res.send(err);
            //res.json({ message: 'Perform successfully deleted' });
            res.redirect("/api/perform");
        });
}
}