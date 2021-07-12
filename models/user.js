var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema(
  {
    a05name:{type:String,required:false},
    a10account:{type:String,required:true},
    a15password:{type:String,required:false},
    a20department:{type:String,required:false},
    a25position:{type:String,required:false},
    a30email:{type:String,required:false},
    a35tel:{type:String,required:false},
    a40mobile:{type:String,required:false},
    a45right:{type:String,required:true},
    a99footnote:{type:String,required:false} 
  }
);

// Virtual for user's URL
UserSchema
.virtual('url')
.get(function () {
  return '/api/user/' + this._id;
});

//Export model
module.exports = mongoose.model('User', UserSchema);