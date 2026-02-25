import mongoose from 'mongoose';

const faceSchema = new mongoose.Schema({
  embedding  : {
    type     : [Number],
    required : true
  },

  box      : {
    x      : Number,
    y      : Number,
    width  : Number,
    height : Number
  }
});

const imageSchema = new mongoose.Schema(
  {
    eventId   : {
      type    : mongoose.Schema.Types.ObjectId,
      ref     : 'Event',
      required: true
    },


    uploadedBy  : {
      type      : mongoose.Schema.Types.ObjectId,
      ref       : 'User',
      required  : true
    },


    imageUrl     : {
      type       : String,
      required   : true
    },

    faces    : [faceSchema] 
  },
  
  { timestamps: true }
);

const Image =  mongoose.model('Image', imageSchema);
export default Image ; 