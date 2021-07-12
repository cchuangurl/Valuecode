//載入相對應的model
const Guess = require('../models/index').guess;
const Turninfo = require('../models/index').turninfo;
const History = require('../models/index').history;
const Parameter = require('../models/index').parameter;
const Hit = require('../models/index').hit;
//const Author = require('../models/author');
module.exports = {
    //創建
    create(req, res) {
        //let turninfo=Turninfo.find({a35waterno:req.body.a10waterno},{_id:{$slice: 1}});
        //let turninfo=Turninfo.find({a35waterno:req.body.a10waterno});        
        //console.log(turninfo);
        let statusreport=req.query.statusreport;
        var new_guess = new Guess(req.body); 
            
        new_guess.save(function(err, guess) {
            if (err)
                res.send(err);                       
                res.redirect("/api/guess/?statusreport="+statusreport)        
            });//EOF .save
                    
    },//EOF create
    //依策略計算
    docalculate(req, res) {
        let statusreport=req.query.statusreport;
        let TL,TNO, PT, SW1, SW2, SW3;//宣告全域基本參數
        let CN1=6,CN2=1, GT1=38, GT2=8, CUTTER=800;//宣告及設定全域基本參數
        let GN1=parseInt((GT1/CN1).toString());
        let historylist=new Array();
        let parameter;
        
        let promise1=(()=>{            
            return new Promise((resolve,reject)=>{
            History.find({}, function(err, historylist0) {
            TL=historylist0.length;
            console.log("history length:"+TL);
            historylist=historylist0;
            console.log("promise1 succeeded!");
            resolve(historylist)
        })//EOF History.find        
        })//EOF Promise
        });//EOF promise1
        let promise2=(historylist=>{            
            return new Promise((resolve,reject)=>{
                Parameter.find({},function(err,paralist){
                    parameter=paralist[paralist.length-1];               
                    console.log("passed history length:"+TL)
                    TNO=TL-CUTTER+1;
                    console.log("predicted data length:"+TNO);
                    PT=parameter.a20posterior;
                    //PT=50;                    
                    SW1=parameter.a25method1;
                    //SW1=3;
                    SW2=parameter.a30method2;
                    //SW2=3;
                    SW3=parameter.a35method3;
                    //SW3=3;                    
                    let historylistcut=new Array();
                    for(let t0=CUTTER;t0<TL;t0++){
                        historylistcut.push(historylist[t0])
                    }
                    //historylistcut=historylist.splice(0,CUTTER);
                    let nextcode={//下期的主觀猜值
                        a15code1:0, 
                        a20code2:0, 
                        a25code3:0, 
                        a30code4:0, 
                        a35code5:0, 
                        a40code6:0,
                        a45extracode:0
                    }//EOF nextcode                    
                    historylistcut.push(nextcode);
                    console.log("data length after cutting:"+historylistcut.length)
                    let historyarray=new Array(TNO);                   
                    let bitcode1=new Array(TNO);
                    let bitcode2=new Array(TNO);                    
                    for(let t=0;t<TNO;t++){
                        historyarray[t]=new Array(CN1+CN2);
                        bitcode1[t]=new Array(GT1);
                        bitcode2[t]=new Array(GT2);                        
                    }
                    let t=0;
                    for(history of historylistcut){
                        historyarray[t][0]=history.a15code1; 
                        historyarray[t][1]=history.a20code2; 
                        historyarray[t][2]=history.a25code3; 
                        historyarray[t][3]=history.a30code4; 
                        historyarray[t][4]=history.a35code5; 
                        historyarray[t][5]=history.a40code6;
                        historyarray[t][6]=history.a45extracode;
                        for(let l1=0;l1<GT1;l1++){
                            bitcode1[t][l1]=0;
                            for(let j=0;j<CN1;j++){
                                if(historyarray[t][j]===l1+1)
                                bitcode1[t][l1]=1
                            }
                        }//EOF for GT1                        
                        for(let l2=0;l2<GT2;l2++){
                            bitcode2[t][l2]=0;
                            if(historyarray[t][6]===l2+1){
                                bitcode2[t][l2]=1
                            }                            
                        }//EOF for GT2
                        t=t+1                        
                    }//EOF for historylistcut
                    console.log("check transbit:"+bitcode2[0][0]+bitcode2[0][1]+bitcode2[0][2]+bitcode2[0][3]+bitcode2[0][4]+bitcode2[0][5]+bitcode2[0][6]+bitcode2[0][7])
                    let intv1=new Array(GT1);
                    let intv2=new Array(GT2);
                    let noshow1=new Array(GT1);
                    let noshow2=new Array(GT2);      
                    let dist1=new Array(GT1);
                    let dist2=new Array(GT2);
                    for(let l1=0;l1<GT1;l1++){
                        intv1[l1]=new Array();
                        dist1[l1]=new Array();
                    }                   
                    for(let l2=0;l2<GT2;l2++){
                        intv2[l2]=new Array();
                        dist2[l2]=new Array();
                    }
                    let h1,h2,g1,g2,Maxnosh1, Maxnosh2,temp0,temp1,temp2;
                    let sum1=new Array(GT1);
                    let sum2=new Array(GT2);
                    let basepro1=new Array(GT1);
                    let basepro2=new Array(GT2);
                    let subdistsum1=new Array(GT1);
                    let subdistsum2=new Array(GT2);
                    let distsum1=new Array(GT1);
                    let distsum2=new Array(GT2);
                    let pro, sortpro;
                    //let originpro=new Array(GT1);                    
                    let pro1SW1=new Array(GT1);
                    let pro1SW2=new Array(GT1);
                    let pro1SW3=new Array(GT1);                    
                    let pro2SW1=new Array(GT2);
                    let pro2SW2=new Array(GT2);
                    let pro2SW3=new Array(GT2);
                    let sortpro1SW1=new Array(GT1);
                    let sortpro1SW2=new Array(GT1);
                    let sortpro1SW3=new Array(GT1);
                    let sortpro2SW1=new Array(GT2);
                    let sortpro2SW2=new Array(GT2);
                    let sortpro2SW3=new Array(GT2);
                    let mixsortrank1=new Array(GT1);
                    let mixsortrank2=new Array(GT2);
                    for(let l1=0;l1<GT1;l1++){
                        //pro1[l1]=new Array(2);
                        //originpro[l1]=new Array(2);
                        pro1SW1[l1]=new Array(2);
                        pro1SW2[l1]=new Array(2);
                        pro1SW3[l1]=new Array(2);
                        sortpro1SW1[l1]=new Array(3); 
                        sortpro1SW2[l1]=new Array(3);
                        sortpro1SW3[l1]=new Array(3);
                        mixsortrank1[l1]=new Array(3)                
                    }
                    for(let l2=0;l2<GT1;l2++){
                        //pro2[l2]=new Array(2);
                        pro2SW1[l2]=new Array(2);
                        pro2SW2[l2]=new Array(2);
                        pro2SW3[l2]=new Array(2);
                        sortpro2SW1[l2]=new Array(3);
                        sortpro2SW2[l2]=new Array(3);
                        sortpro2SW3[l2]=new Array(3);
                        mixsortrank2[l2]=new Array(3)                   
                    }
                    let postguesslist=new Array(GN1);
                    for(let gn=0;gn<GN1;gn++){
                        postguesslist[gn]=new Array()
                    }
                    let nextguess=new Array();                    
                    let transtointv=((GT,It,bitcode)=>{
                        let intv=new Array(GT);
                        for(let l=0;l<GT;l++){
                            intv[l]=new Array();
                            h=0;
                            g=0;
                            for(let t=0;t<TNO-PT+It;t++){
                                if(bitcode[t][l]===0){
                                    h++
                                }else{
                                    intv[l][g]=h;
                                    h=0;
                                    g++
                                }//EOF if-else                                                
                            }//EOF for It                                                     
                        }//EOF GT
                        console.log("check first intv:"+intv[0][0])
                        return intv
                        });//EOF transtointv
                    let getnoshow=((GT,intv)=>{
                        let noshow=new Array(GT);
                        for(let l=0;l<GT;l++){
                            noshow[l]=intv[l][intv[l].length-1];                            
                        }                        
                        console.log("check noshow:"+noshow[0])
                        console.log("finished getnoshow")
                        return noshow
                    });//EOF getnoshow
                    let calcdist=((GT,intv)=>{
                        let dist=new Array(GT);
                        for(let l=0;l<GT;l++){
                            dist[l]=new Array();
                            Maxnosh=0;
                            for(let g=0;g<intv[l].length;g++){
                                Maxnosh=Math.max(Maxnosh, intv[l][g])
                            }
                            for(let j=0;j<Maxnosh+1;j++){
                                dist[l][j]=0;
                                for(let g=0;g<intv[l].length;g++){
                                    if(intv[l][g]===j){
                                        dist[l][j]=dist[l][j]+1
                                    }
                                }
                            }//EOF for Maxnosh
                        }//EOF GT1
                        console.log("checkmessage Maxnoshow:"+Maxnosh)
                        console.log("check dist[0][3]:"+dist[0][3])
                        return dist
                    });//EOF calcdist
                    let calcsubdistsum=((GT,noshow,dist)=>{
                        let subdistsum=new Array(GT);
                        for(let l=0;l<GT;l++){
                            subdistsum[l]=0;
                            for(let g=noshow[l];g<dist[l].length;g++){
                                subdistsum[l]=subdistsum[l]+dist[l][g]
                            }
                            }
                            console.log("check subdistsum[0]:"+subdistsum[0])
                            return subdistsum  
                    });//EOF calcsubdistsum
                    let calcdistsum=((GT,dist)=>{
                        let distsum=new Array(GT);
                        for(let l=0;l<GT;l++){
                            distsum[l]=0;
                            for(let g=0;g<dist[l].length;g++){
                                distsum[l]=distsum[l]+dist[l][g]
                            }
                            }
                            console.log("check distsum[0]:"+distsum[0])
                            return distsum        
                    });//EOF calcdistsum
                    let calcpro=((GT,It,bitcode)=>{
                        let sum=new Array(GT);
                        let basepro=new Array(GT);
                        for(let l=0;l<GT;l++){
                            sum[l]=0;
                            for(let it=0;it<TNO-PT+It;it++){
                                sum[l]=sum[l]+bitcode[it][l]
                            }
                            basepro[l]=sum[l]/(TNO-PT+It);
                        }
                            console.log("check basepro[0]:"+basepro[0])
                        console.log("--------------------------")
                        return basepro
                    });//EOF calcpro
                    let getpro=((GT,noshow,basepro, dist, subdistsum, distsum,SW)=>{
                        pro=new Array(GT);                            
                        for(let l=0;l<GT;l++){
                            pro[l]=new Array(2);
                            pro[l][0]=l+1;
                        //console.log("strategy:"+SW)
                        switch(SW){
                        case 1:
                            pro[l][1]=basepro[l];
                            break;
                        case 2:
                            pro[l][1]=dist[l][noshow[l]]/subdistsum[l];
                            break;
                        case 3:
                            pro[l][1]=noshow[l]/dist[l].length;
                            break;
                        case 4:
                            pro[l][1]=dist[l][noshow[l]]/distsum[l];
                            break;
                        case 5:
                            pro[l][1]=(distsum[l]-subdistsum[l]-dist[l][noshow[l]+1])/distsum[l];
                            break;
                        case 6:
                            pro[l][1]=basepro[l]+(dist[l][noshow[l]]/subdistsum1[l]);
                            break;
                        case 7:
                            pro[l][1]=(dist[l][noshow[l]]/subdistsum[l])+(distsum[l]-subdistsum[l]-dist[l][noshow[l]])/distsum[l];
                            break;
                        case 8:
                            pro[l][1]=basepro[l]+(distsum[l]-subdistsum[l]-dist[l][noshow[l]])/distsum1[l];
                            break;
                        case 9:
                            pro[l][1]=(dist[l][noshow[l]]/subdistsum[l])+(noshow[l]/dist[l].length);
                            break;
                        case 10:
                            pro[l][1]=basepro[l]+(dist[l][noshow[l]]/subdistsum[l])+(distsum[l]-subdistsum[l]-dist[l][noshow[l]])/distsum1[l];;
                            break;                            
                        }//EOF SW
                       //console.log(pro[l][0])
                       //console.log(pro[l][1]);
                        }//EOF for GT
                        return pro
                    });//EOF getpro
                    let getsortpro=((GT,originpro)=>{                        
                        sortpro=new Array(GT);
                        for(let l=0;l<GT;l++){
                            sortpro[l]=new Array(3);
                            //console.log(originpro[l][0]+originpro[l][1]);
                            for(let c=0;c<2;c++){
                                sortpro[l][c]=originpro[l][c]
                            }
                        }                           
                        for(let L=0;L<GT-1;L++){                            
                            for(let i=0;i<GT-L-1;i++){
                                if(sortpro[i][1]<sortpro[i+1][1]){
                                    temp1=sortpro[i][1];
                                    temp0=sortpro[i][0];
                                    sortpro[i][1]=sortpro[i+1][1];
                                    sortpro[i][0]=sortpro[i+1][0];
                                    sortpro[i+1][1]=temp1;
                                    sortpro[i+1][0]=temp0
                                }//EOF if
                            }//EOF for GT-L-1
                        }//EOF for GT-1
                        for(let l=0;l<GT;l++){
                        sortpro[l][2]=l+1
                        }//store rank of each no
                        for(let L=0;L<GT-1;L++){                            
                            for(let i=0;i<GT-L-1;i++){
                                if(sortpro[i][0]>sortpro[i+1][0]){
                                    temp1=sortpro[i][1];
                                    temp0=sortpro[i][0];
                                    temp2=sortpro[i][2];
                                    sortpro[i][1]=sortpro[i+1][1];
                                    sortpro[i][0]=sortpro[i+1][0];
                                    sortpro[i][2]=sortpro[i+1][2];
                                    sortpro[i+1][1]=temp1;
                                    sortpro[i+1][0]=temp0;
                                    sortpro[i+1][2]=temp2
                                }//EOF if
                            }//EOF for GT-L-1
                    }//EOF for GT-1
                    return sortpro
                    });//EOF getsortpro
                    let getmixsortrank=((GT,sortproSW1,sortproSW2,sortproSW3)=>{
                        let mixsort=new Array(GT); 
                        for(let l=0;l<GT;l++){
                            mixsort[l]=new Array(3);
                            mixsort[l][0]=sortproSW1[l][0];
                            mixsort[l][1]=sortproSW1[l][2]+sortproSW2[l][2]+sortproSW3[l][2]                           
                        }
                        for(let L=0;L<GT-1;L++){                            
                            for(let i=0;i<GT-L-1;i++){
                                if(mixsort[i][1]<mixsort[i+1][1]){
                                    temp1=mixsort[i][1];
                                    temp0=mixsort[i][0];
                                    mixsort[i][1]=mixsort[i+1][1];
                                    mixsort[i][0]=mixsort[i+1][0];
                                    mixsort[i+1][1]=temp1;
                                    mixsort[i+1][0]=temp0
                                }//EOF if
                            }//EOF for GT-L-1
                        }//EOF for GT-1 
                        for(let l=0;l<GT;l++){
                            mixsort[l][2]=l+1
                            }//store rank of each no
                        return mixsort
                    });//EOF getmixsortrank
                    let storepostguess=((It,sortpro1,sortpro2)=>{
                        for(let gn=0;gn<GN1;gn++){
                            let new_postguess=new Guess({                                
                                a10ans_set:gn+1,
                                a15waterno:(historylistcut[TNO-PT+It-1].a10waterno)+1,
                                a20guess1:sortpro1[gn*6+0][0],
                                a25guess2:sortpro1[gn*6+1][0],
                                a30guess3:sortpro1[gn*6+2][0],
                                a35guess4:sortpro1[gn*6+3][0],
                                a40guess5:sortpro1[gn*6+4][0],
                                a45guess6:sortpro1[gn*6+5][0],
                                a50guessextra:sortpro2[3][0]
                            })
                            postguesslist[gn].push(new_postguess);                            
                        }//EOF for gn
                        console.log("new_postguess turn:"+postguesslist[0][postguesslist[0].length-1].a15waterno) 
                    });//EOF storepostguess                 
                    
                let dopostguess=(()=>{
                    for(let it=0;it<PT;it++){
                        intv1=transtointv(GT1,it,bitcode1);
                        intv2=transtointv(GT2,it,bitcode2);
                        noshow1=getnoshow(GT1,intv1);
                        noshow2=getnoshow(GT2,intv2);
                        dist1=calcdist(GT1,intv1);
                        dist2=calcdist(GT2,intv2);
                        subdistsum1=calcsubdistsum(GT1,noshow1,dist1);
                        subdistsum2=calcsubdistsum(GT2,noshow2,dist2);
                        distsum1=calcdistsum(GT1,dist1);
                        distsum2=calcdistsum(GT2,dist2);
                        basepro1=calcpro(GT1,it,bitcode1);
                        basepro2=calcpro(GT2,it,bitcode2);                                              
                        pro1SW1=getpro(GT1,noshow1, basepro1,dist1,subdistsum1, distsum1,SW1);
                        pro1SW2=getpro(GT1,noshow1, basepro1,dist1,subdistsum1, distsum1,SW2);
                        pro1SW3=getpro(GT1,noshow1, basepro1,dist1,subdistsum1, distsum1,SW3);
                        pro2SW1=getpro(GT2,noshow2, basepro2,dist2,subdistsum2, distsum2,SW1);
                        pro2SW2=getpro(GT2,noshow2, basepro2,dist2,subdistsum2, distsum2,SW2);
                        pro2SW3=getpro(GT2,noshow2, basepro2,dist2,subdistsum2, distsum2,SW3);
                        sortpro1SW1=getsortpro(GT1,pro1SW1);
                        sortpro1SW2=getsortpro(GT1,pro1SW2);
                        sortpro1SW3=getsortpro(GT1,pro1SW3);
                        sortpro2SW1=getsortpro(GT2,pro2SW1);
                        sortpro2SW2=getsortpro(GT2,pro2SW2);
                        sortpro2SW3=getsortpro(GT2,pro2SW3);
                        mixsortrank1=getmixsortrank(GT1,sortpro1SW1,sortpro1SW2,sortpro1SW3)
                        mixsortrank2=getmixsortrank(GT2,sortpro2SW1,sortpro2SW2,sortpro2SW3)
                        storepostguess(it,mixsortrank1,mixsortrank2);

                    }//EOF for PT
                })//EOF dopostguess
                let evaluatepost=((postguesslist)=>{
                    console.log("post guess length:"+postguesslist[0].length);
                    let outcome=new Array(CN1+CN2);
                    let history=new Array(CN1+CN2);
                    let punch1=new Array(GN1);
                    let punch2=new Array(GN1);
                    //let hitlist=new Array(GN1);
                    let punch1sum=new Array(GN1);
                    let squaresum=new Array(GN1);
                    let punch1bar=new Array(GN1);
                    let punch1std=new Array(GN1);
                    for(let gn=0;gn<GN1;gn++){
                        punch1[gn]=new Array(PT);
                        punch2[gn]=new Array(PT);
                        //hitlist[gn]=new Array(PT);
                        punch1sum[gn]=0;
                        squaresum[gn]=0;
                        for(let it=0;it<PT;it++){
                            let historyit=historylistcut[TNO-PT+it];
                            //console.log(postguesslist[gn][it]);
                            guessit=postguesslist[gn][it];
                            //console.log(guessit);
                            console.log("history turn:"+historyit.a10waterno+" ;guess turn:"+guessit.a15waterno);                        
                                punch1[gn][it]=0;
                                punch2[gn][it]=0;
                                outcome[0]=guessit.a20guess1;
                                outcome[1]=guessit.a25guess2;
                                outcome[2]=guessit.a30guess3;
                                outcome[3]=guessit.a35guess4;
                                outcome[4]=guessit.a40guess5;
                                outcome[5]=guessit.a45guess6;
                                outcome[6]=guessit.a50guessextra;
                                history[0]=historyit.a15code1;
                                history[1]=historyit.a20code2;
                                history[2]=historyit.a25code3;
                                history[3]=historyit.a30code4;
                                history[4]=historyit.a35code5;
                                history[5]=historyit.a40code6;
                                history[6]=historyit.a45extracode;
                                console.log("This history ->"+history);
                                console.log("processing guess ->"+outcome)
                                for(let i=0;i<CN1;i++) {
                                    for(let j=0;j<CN1;j++) {
                                        if(outcome[i]===history[j]) {
                                            punch1[gn][it]=punch1[gn][it]+1;
                                            }
                                    }//EOF for j
                                                            
                                    }//EOF for i
                                    if(outcome[CN1]===history[CN1]) {
                                        punch1[gn][it]=punch1[gn][it]+1.5;                                
                                    }
                                if(punch1>=2.4) {
                                    punch2[gn][it]=punch1[gn][it];
                                }else {
                                    punch2[gn][it]=0;
                                }
                                punch1sum[gn]=punch1sum[gn]+punch1[gn][it];
                                squaresum[gn]=squaresum[gn]+punch1[gn][it]*punch1[gn][it];
                                console.log("hit of set"+gn+":"+punch1[gn][it])
                                /* let new_hit=new Hit({
                                    a05guess_ids:guessit._id,
                                    a10waterno:guessit.a15waterno,
                                    a15no_hit:punch1[gn][it],
                                    a20effect_hit:punch2[gn][it]
                                })//EOF new_hit
                                hitlist.push(new_hit); */
                        }//EOF for PT
                        punch1bar[gn]=punch1sum[gn]/PT;
                        punch1std[gn]=Math.sqrt((squaresum[gn]-PT*punch1bar[gn]*punch1bar[gn])/(PT-1));
                        
                        guessPT=postguesslist[gn][PT-1];
                        let next_guess=new Guess({
                            a05parameter_ids:parameter._id,
                            a10ans_set:gn+1,
                            a15waterno:guessPT.a15waterno,
                            a20guess1:guessPT.a20guess1,
                            a25guess2:guessPT.a25guess2,
                            a30guess3:guessPT.a30guess3,
                            a35guess4:guessPT.a35guess4,
                            a40guess5:guessPT.a40guess5,
                            a45guess6:guessPT.a45guess6,
                            a50guessextra:guessPT.a50guessextra,
                            a55guessxbar:punch1bar[gn],
                            a60guessstd:punch1std[gn]
                        })
                        let sequence=Promise.resolve();                
                        sequence=sequence.then(()=>{
                        return promise3(next_guess).then()
                        .catch(err=>{
                            console.log(err)
                        })
                        })//EOF sequence                        
                    }//EOF for gn                   
                    for(let it=0;it<PT;it++){
                        console.log("No. of punch for turn "+it+":group A="+punch1[0][it]+" ;group B="+punch1[1][it]+" ;group C="+punch1[2][it]+" ;group D="+punch1[3][it]+" ;group E="+punch1[4][it]+" ;group F="+punch1[5][it])
                    }
                    console.log("-----------------------------------------------------------------------------------")
                    console.log("No. of punchsum:group A="+punch1sum[0]+" ;group B="+punch1sum[1]+" ;group C="+punch1sum[2]+" ;group D="+punch1sum[3]+" ;group E="+punch1sum[4]+" ;group F="+punch1sum[5])
                    console.log("std of punch:group A="+punch1std[0]+" ;group B="+punch1std[1]+" ;group C="+punch1std[2]+" ;group D="+punch1std[3]+" ;group E="+punch1std[4]+" ;group F="+punch1std[5]) 
                    })//EOF evaluatepost

                dopostguess();
                evaluatepost(postguesslist);
            resolve() 
        })//EOF of findOne        
        })//EOF Promise
        });//EOF promise2
            let promise3=((next_guess)=>{
                return new Promise((resolve,reject)=>{            
                next_guess.save(function(err, newguess) {
                    console.log("saved ans_set:"+newguess.a10ans_set)    
                })//EOF save
                resolve()
                })//EOF return Promise
                });//EOF promise3
        
        promise1()
        .then((historylist)=>{
            promise2(historylist)
        })
        .catch(err=>{
            console.log(err)
        });
        setTimeout(()=>{
            res.redirect("/api/guess/?statusreport="+statusreport)
            //res.end()
        },3000)
        
    },//EOF docalculate
    //列表項
    list(req, res) {
        var listreport=req.query.statusreport;
        Guess.find({},null,{sort: {a15waterno:-1,a05parameter_ids:-1,a10ans_set:1}}, function(err, guess) {
            if (err)
            res.send(err);
            //res.json(guess);
            res.render("guess/listpage",{
                statusreport:listreport,
                guesslist:guess
            })
        });
    },
    //取得某項
    retrieve(req, res) {
        var editreport=req.body.statusreport;
        Guess.findById(req.params.id, function(err, guess) {
            if (err)
                res.send(err);
            //res.json(guess);
            res.render("guess/editpage",{
                statusreport:editreport,
                guess:guess
            })
        });
    },
    //更新
    update(req, res) {
        Guess.findOneAndUpdate({_id:req.params.id}, req.body, { new: true }, function(err, guess) {
            if (err)
                res.send(err);
            //res.json(guess);
            res.redirect("/api/guess");
        });
    },
    //刪除
    destroy(req, res) {
        Guess.remove({_id: req.params.id}, function(err, guess) {
        //Guess.findByIdAndRemove(req.params.id, function(err, guess) {
            if (err)
                res.send(err);
            //res.json({ message: 'Guess successfully deleted' });
            res.redirect("/api/guess");
        });
}

}//EOF export