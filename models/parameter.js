var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ParameterSchema = new Schema(
  {
    a05waterno:{type:Number,required:true},
    a10pull:{type:Number,required:false},
    a15cutter:{type:Number,required:false},
    a20posterior:{type:Number,required:false},
    a25method1:{type:Number,required:false},
    a30method2:{type:Number,required:false},
    a35method3:{type:Number,required:false},
    a40hurdle:{type:Number,required:false},
    a45increment:{type:Number,required:false},
    a50ceiling:{type:Number,required:false},
    a99footnote:{type:String,required:false}
  }
);

// Virtual for parameter's URL
ParameterSchema
.virtual('url')
.get(function () {
  return '/api/parameter/' + this._id;
});

//Export model
module.exports = mongoose.model('Parameter', ParameterSchema);