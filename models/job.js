const mongoose=require('mongoose');
const { Employee } = require('./employer');
const { Candidate } = require('./candidate');

const jobSchema=new mongoose.Schema({
   jobname:String,
   jobdesignation:String,
   joblocation:String,
   jobsalary:Number,
   postedby:
   {
       type:mongoose.Schema.Types.ObjectId,
       ref:'Employee'
   },
   appliedby:[
       {appliedid:{
           type:mongoose.Schema.Types.ObjectId
           ,ref:'Employee' 
       }}
   ]
    ,
   jobstatus:String
})

const Job=mongoose.model('Job',jobSchema)

module.exports.Job=Job;