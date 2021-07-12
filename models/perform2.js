var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PerformSchema = new Schema(
  {
    a05guess_ids:{type:Schema.Types.ObjectId,required:false},
    a10waterno:{type:Number,required:true},
    a15sw1:{type:Number,required:false},
    a20sw2:{type:Number,required:false},
    a25sw3:{type:Number,required:false},
    a30ans_set:{type:Number,required:false},
    a35hit:{type:Number,required:false},
    a40effecthit:{type:Number,required:false},
    a45hitmean:{type:Number,required:false},
    a45expectaward:{type:Number,required:false},
    a99footnote:{type:String,required:false}
  }
);

// Virtual for perform's URL
PerformSchema
.virtual('url')
.get(function () {
  return '/api/perform/' + this._id;
});

//Export model
module.exports = mongoose.model('Perform2', PerformSchema);