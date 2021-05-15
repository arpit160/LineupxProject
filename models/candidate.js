const mongoose=require('mongoose');
const{Job}=require('./job');
const bcrypt=require('bcrypt')

const candidateSchema=new mongoose.Schema({
    email:
    {
        type:String
    },
    password:
    {
        type:String
    },
    candidatename:
    {
        type:String
    },
    rejectedjobs:
    [
        {
            rejectedjob:{type:mongoose.Schema.Types.ObjectID,ref:'Job'}
        }
    ],
    appliedjobs:
    [
        {
            appliedjob:{type:mongoose.Schema.Types.ObjectID,ref:'Job'}  
        }
    ]
    ,
})
candidateSchema.pre("save",async function(next)
{
    const salt = await bcrypt.genSalt(6);
    const hashed = await bcrypt.hash(this.password, salt);
    this.password=hashed;
    next();
})

Candidate=mongoose.model('Candidate',candidateSchema)

module.exports={Candidate};