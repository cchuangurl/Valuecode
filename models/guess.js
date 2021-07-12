var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var GuessSchema = new Schema(
  {
    a05parameter_ids:{type:Schema.Types.ObjectId,required:false},
    a10ans_set:{type:Number,required:false},
    a15waterno:{type:Number,required:true},
    a20guess1:{type:Number,required:true},
    a25guess2:{type:Number,required:true},
    a30guess3:{type:Number,required:true},
    a35guess4:{type:Number,required:true},
    a40guess5:{type:Number,required:true},
    a45guess6:{type:Number,required:true},
    a50guessextra:{type:Number,required:false},
    a55guessxbar:{type:Number,required:false},
    a60guessstd:{type:Number,required:false},
    a65magictable:{type:Array,required:false},
    a99footnote:{type:String,required:false}
  }
);

// Virtual for guess's URL
GuessSchema
.virtual('url')
.get(function () {
  return '/api/guess/' + this._id;
});

//Export model
module.exports = mongoose.model('Guess', GuessSchema);