//載入相對應的model
const Hit = require('../models/index').hit;
const Perform = require('../models/index').perform;
//const History = require('../models/index').history;
//const Author = require('../models/author');
module.exports = {
    //績效列表項
    list(req, res) {
        var listreport=req.query.statusreport;
        var performlist=new Array();
        let promise=(()=>{
            return new Promise((resolve,reject)=>{
            //Hit.find({},{sort:{a10waterno:-1,a25ans_set:1}},function(err, hitlist) {
            Hit.find({},function(err, hitlist) {
            let hittime=1, hitsum=0, awardsum=0, hitmean=0, progress=0, lasthitmean=0;
               for(let hit of hitlist){
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
                let perform_new=new Perform({
                    a05hit_ids:hit._id,
                    a10waterno:hit.a10waterno,
                    a15expectaward:awardsum,
                    a20hitmean:hitmean,
                    a25progress:progress
                })
                performlist.push(perform_new)
            }//EOF for hit
            if (err)
            res.send(err);
        })//EOF find
        resolve()
    })//EOF new Promise
    })//EOF promise       
        //res.json(perform);
    
        promise()
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