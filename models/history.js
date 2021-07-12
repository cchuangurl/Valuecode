var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var HistorySchema = new Schema(
  {
    a05turninfo_ids:{type:Schema.Types.ObjectId,required:false},
    a10waterno:{type:Number,required:true},
    a15code1:{type:Number,required:true},
    a20code2:{type:Number,required:true},
    a25code3:{type:Number,required:true},
    a30code4:{type:Number,required:true},
    a35code5:{type:Number,required:true},
    a40code6:{type:Number,required:true},
    a45extracode:{type:Number,required:true},
    a99footnote:{type:String,required:false}
  }
);

// Virtual for history's URL
HistorySchema
.virtual('url')
.get(function () {
  return '/api/history/' + this._id;
});

//Export model
module.exports = mongoose.model('History', HistorySchema);