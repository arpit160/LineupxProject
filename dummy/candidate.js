const {Candidate}=require('../models/candidate');
const mongoose=require('mongoose');

mongoose.connect('mongodb+srv://ArpitSinghal:Arpit@123@cluster0.gxqem.mongodb.net/db2021?retryWrites=true&w=majority'
, {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>
{
console.log('database connected')
})
.catch((e)=>{console.log(e)});

const arr=[
    {
        candidatename:"cand1",
        email:"cand1@gmail.com",
        password:"abc"
    },
    {
        candidatename:"cand4",
        email:"cand4@gmail.com",
        password:"abc"
    },
    {
        candidatename:"cand2",
        email:"cand2@gmail.com",
        password:"abc"
    },
    {
        candidatename:"cand3",
        email:"cand3@gmail.com",
        password:"abc"
    },
   

];

async function create()
{
    await Candidate.deleteMany({});
    for(let i=0;i<arr.length;i++)
    {
        let x=new Candidate(arr[i]);
        await x.save();
    }
}

create();
