var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TurninfoSchema = new Schema(
  {
    a05sixtype:{type:String,required:false},
    a10period:{type:Number,required:true},
    a15date:{type:Date,required:false},
    a20machine:{type:Number,required:false},
    a25ballset:{type:Number,required:false},
    a30direction:{type:Number,required:false},
    a35waterno:{type:Number,required:true},
    a99footnote:{type:String,required:false}
  }
);

// Virtual for turninfo's URL
TurninfoSchema
.virtual('url')
.get(function () {
  return '/api/turninfo/' + this._id;
});

//Export model
module.exports = mongoose.model('Turninfo', TurninfoSchema);