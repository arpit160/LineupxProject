const {Job}=require('../models/job');
const mongoose=require('mongoose');

mongoose.connect('mongodb+srv://ArpitSinghal:Arpit@123@cluster0.gxqem.mongodb.net/db2021?retryWrites=true&w=majority'
, {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>
{
console.log('database connected')
})
.catch((e)=>{console.log(e)});

const jobsarr=[
    {
        jobname:"job1"
        ,jobdesignation:"sde2"
        ,jobsalary:500000
        ,joblocation:"noida"
        ,postedby:"609ecd5a4f5ebc6fe0389fad"
        ,status:""
    },
    {
        jobname:"job2"
        ,jobdesignation:"sde1"
        ,jobsalary:500000
        ,joblocation:"noida"
        ,postedby:"609ecd5a4f5ebc6fe0389fad"
        ,status:""
    },
    {
        jobname:"job3"
        ,jobdesignation:"R&D"
        ,jobsalary:500000
        ,joblocation:"jaipur"
        ,postedby:"609ecd5a4f5ebc6fe0389fad"
        ,status:""
    },
    {
        jobname:"job4"
        ,jobdesignation:"SRE"
        ,jobsalary:500000
        ,joblocation:"Pune"
        ,postedby:"609ecd5b4f5ebc6fe0389fae"
        ,status:""
    },
    {
        jobname:"job5"
        ,jobdesignation:"Analyst"
        ,jobsalary:500000
        ,joblocation:"mumbai"
        ,postedby:"609ecd5b4f5ebc6fe0389fae"
        ,status:""
    },
    
    {
        jobname:"job6"
        ,jobdesignation:"HR manager"
        ,jobsalary:500000
        ,joblocation:"Bengaluru"
        ,postedby:"609ecd5b4f5ebc6fe0389fae"
        ,status:""
    },
    {
        jobname:"job7"
        ,jobdesignation:"Devops Engineer"
        ,jobsalary:500000
        ,joblocation:"Bengaluru"
        ,postedby:"609ecd5b4f5ebc6fe0389fae"
        ,status:""
    }

];

async function createJobs()
{
    await Job.deleteMany({});
    for(let i=0;i<jobsarr.length;i++)
    {
        let newjob=new Job(jobsarr[i]);
        await newjob.save();
    }
}

createJobs();
