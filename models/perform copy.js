var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PerformSchema = new Schema(
  {
    a05hit_ids:{type:Schema.Types.ObjectId,required:false},
    a10waterno:{type:Number,required:true},
    a15expectaward:{type:Number,required:false},
    a20hitmean:{type:Number,required:false},
    a25progress:{type:Number,required:false},
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
module.exports = mongoose.model('Perform', PerformSchema);