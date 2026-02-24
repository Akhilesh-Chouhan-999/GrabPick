import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({

      title      :{
      type       : String,
      required   : true,
      trim       : true
    },

    description : {
      type      : String
    },

    organizerId: {
      type     : mongoose.Schema.Types.ObjectId,
      ref      : 'User',
      required : true
    },

    eventDate: {
      type   : Date
    },

    location: {
      type  : String
    },

    isActive : {
      type   : Boolean,
      default: true
    }

  },
  
  { timestamps : true }
);

const Event = mongoose.model('Event' , eventSchema) ; 
export default Event ;
