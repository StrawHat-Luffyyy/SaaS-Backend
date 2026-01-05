import mongoose from 'mongoose';

const auditSchema = new mongoose.Schema(
  {
    orgId : {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    userId : {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',  
      required: true,
    },
    action : {
      type: String,
    },
    meta : {
      type : String
    }
  } , { timestamps: true });


  export default mongoose.model('Audit', auditSchema);