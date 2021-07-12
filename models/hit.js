var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var HitSchema = new Schema(
  {
    a05guess_ids:{type:Schema.Types.ObjectId,required:false},
    a10waterno:{type:Number,required:true},
    a15no_hit:{type:Number,required:false},
    a20effect_hit:{type:Number,required:false},
    a25ans_set:{type:Number,required:false},
    a99footnote:{type:String,required:false}
  }
);


// Virtual for hit's URL
HitSchema
.virtual('url')
.get(function () {
  return '/api/hit/' + this._id;
});

//Export model
module.exports = mongoose.model('Hit', HitSchema);