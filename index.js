const express= require("express");
const mongoose=require('mongoose');
const path=require('path');
const app=express();
const bodyParser = require('body-parser');
const { connectDb } = require("./connectDb");
const session=require('express-session');
const bcrypt=require('bcrypt');
const { Employee } = require("./models/employer");
const { Candidate } = require("./models/candidate");
const { Job } = require("./models/job");
const objectId = require('mongodb').ObjectID;

const {checkcandidatelogin,checkemployeelogin}=require('./middleware')


app.use(session({
    resave:false,
    saveUninitialized:true,
    secret:"arpitsinghal"
}))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))

connectDb();

app.get('/',(req,res)=>
{
    res.render('home')
})


//---------------Employer---------------//
// -------Employer has been mispelled as employee, kindly ignore it----------------//

app.get('/employee/register',(req,res)=>
{
  res.render('employee/employeeregister');
})
app.post('/employee/register',async (req,res)=>
{
    email=req.body.email;
    employeeCheck=await Employee.findOne({email});
    if(employeeCheck)
    {
        return res.send("Email Already Exists");
    }
    password=req.body.password;
    
    employee=new Employee(req.body);
    await employee.save();
    res.redirect('/employee/login')
})
app.get('/employee/login',(req,res)=>
{
  res.render('employee/employeelogin');
})
app.post('/employee/login',async (req,res)=>
{
    password=req.body.password;
    employee=await Employee.findOne({email:req.body.email});
    if(!employee)
    {
        return  res.send("Invalid Credentials");
    }
    hashed=employee.password;
    if(!bcrypt.compareSync(password,hashed))
    {
        return  res.send("Invalid Password");
    }
    req.session.employee=employee;
    res.redirect(`/employee/postedjobs/${employee._id}`);
})
app.get('/employee/postedjobs/:eid',checkemployeelogin,async(req,res)=>
{
    const{eid}=req.params
    currentemployee=req.session.employee;
    employeename=currentemployee.employeename;
    let jobsposted=await Job.find({postedby:currentemployee._id}).populate({path:'appliedby.appliedid',model:'Candidate'});
    jobsposted.forEach((a)=>
    {
        console.log(a.appliedby)
    })
    res.render('employee/postedjobs',{jobsposted,employeename,eid})
})

app.get('/employee/createjob/:id',checkemployeelogin,(req,res)=>
{
    id=req.params.id;
    res.render(`employee/createjob`,{id});
})

app.post('/employee/createjob/:id',checkemployeelogin,async(req,res)=>
{
    employeeid=req.params.id;
    body=req.body;
    console.log(employeeid)
    body.postedby=objectId(employeeid);
    console.log(body)
    job=new Job(body)
    await job.save();
    res.redirect(`/employee/postedjobs/${employeeid}`)
})

app.get('/employee/logout',checkemployeelogin,(req,res)=>
{
    delete req.session.employee;
    res.redirect('/employee/login');
})


//-------------------------Candidates----------------------------------------//


app.get('/candidate/register',(req,res)=>
{
  res.render('candidate/candidateregister');
})
app.post('/candidate/register',async (req,res)=>
{
    email=req.body.email;
    candidateCheck=await Candidate.findOne({email});
    if(candidateCheck)
    {
        return res.send("Email Already Exists");
    }
    candidate=new Candidate(req.body);
    await candidate.save();
    res.redirect('/candidate/login')
})
app.get('/candidate/login',(req,res)=>
{
  res.render('candidate/candidatelogin');
})
app.post('/candidate/login',async (req,res)=>
{
    password=req.body.password;
    candidate=await Candidate.findOne({email:req.body.email});
    if(!candidate)
    {
        return  res.send("Invalid Credentials");
    }
    hashed=candidate.password;
    if(!bcrypt.compareSync(password,hashed))
    {
        return  res.send("Invalid Password");
    }
    req.session.candidate=candidate;
    res.redirect(`/candidate/availablejobs/${candidate._id}`);
})

app.get('/candidate/availablejobs/:candidateid',checkcandidatelogin,async (req,res)=>
{
    candidateid=req.params.candidateid;
    candidate=await Candidate.findOne({_id:candidateid}).populate({path:'rejectedjobs.rejectedjob',model:'Job'}).populate({path:'appliedjobs.appliedjob',model:'Job'});
    appliedarr=candidate.appliedjobs;
    rejectedarr=candidate.rejectedjobs;

    jobarray=await Job.find({}).populate("postedby");
    jobbrr=[];
    console.log(jobarray)
    console.log(appliedarr)
    console.log(rejectedarr)
    jobarray.forEach((x)=>
    {
        let a=1;
        let b=1;           

        for(let i of appliedarr)
        {
            if(i.appliedjob && (i.appliedjob._id.toString()===x._id.toString()))
            {
                console.log("yesss",toString(i.appliedjob._id))
                a=0; break;
            }
        }
        for(let i of rejectedarr)
        {
            if(i.rejectedjob && (i.rejectedjob._id.toString()==x._id.toString()))
            {
                b=0; break;
            }
        }
        if(a && b)
        {
            jobbrr.push(x);
        }
    })
    
    
    return res.render('candidate/availablejobs',{jobarr:jobbrr,name:candidate.candidatename});
})

app.post('/candidate/applyjob/:jobid/:candidateid',checkcandidatelogin,async (req,res)=>
{
    const{candidateid,jobid}=req.params;
    arr=await Candidate.findOne({_id:candidateid});
    arr=arr.appliedjobs;
    console.log(arr)
    arr.push({'appliedjob':jobid});
    await Candidate.updateOne({_id:candidateid},{$set:{appliedjobs:arr}})

    job=await Job.findOne({_id:jobid});
    arr=job.appliedby;
    arr.push({'appliedid':candidateid});
    await Job.updateOne({_id:jobid},{$set:{appliedby:arr}});

    return res.redirect(`/candidate/availablejobs/${candidateid}`)
})
app.post('/candidate/rejectjob/:jobid/:candidateid',checkcandidatelogin,async (req,res)=>
{
    const{candidateid,jobid}=req.params;
    arr=await Candidate.findOne({_id:candidateid});
    arr=arr.rejectedjobs;

    arr.push({'rejectedjob':jobid});
    await Candidate.updateOne({_id:candidateid},{$set:{rejectedjobs:arr}})

    return res.redirect(`/candidate/availablejobs/${candidateid}`)
})
app.get('/candidate/appliedjobs/:candidateid',checkcandidatelogin,async (req,res)=>
{
    candidateid=req.params.candidateid;
    const x={
        path:'appliedjobs',
        populate:
        ({
            path:'appliedjob',
            model:'Job',
            populate:
            ({
                path:'postedby',model:'Employee'
            })
        })
        
    };
    candidate=await Candidate.findOne({_id:candidateid}).populate({path:'appliedjobs.appliedjob',model:'Job'}).populate(x);
    arr=candidate.appliedjobs
    console.log(arr)
    appliedarr=[];
    arr.forEach((a)=>
    {
        appliedarr.push(a.appliedjob)
    })
     console.log(appliedarr)
    return res.render('candidate/appliedjobs',{jobarr:appliedarr,name:candidate.candidatename,candidateid:candidate._id});
})
app.get('/candidate/rejectedjobs/:candidateid',checkcandidatelogin,async (req,res)=>
{
    candidateid=req.params.candidateid;
    candidate=await Candidate.findOne({_id:candidateid}).populate({path:'rejectedjobs.rejectedjob',model:'Job'}).populate({path:'rejectedjobs.rejectedjob.postedby',model:'Employee'});
    arr=candidate.rejectedjobs;
    rejectedarr=[]
    arr.forEach(function(a)
    {
        rejectedarr.push(a.rejectedjob);
    })
    return res.render('candidate/rejectedjobs',{jobarr:rejectedarr,name:candidate.candidatename,candidateid:candidate._id});
})

app.get('/candidate/dereject/:jobid/:candidateid',checkcandidatelogin,async (req,res)=>
{
    const{candidateid,jobid}=req.params;
    arr=await Candidate.findOne({_id:candidateid}).populate({path:'rejectedjobs.rejectedjob',model:'Job'});
    arr=arr.rejectedjobs;
    brr=arr.filter((a)=>{return a.rejectedjob._id!=jobid});
    await Candidate.updateOne({_id:candidateid},{$set:{rejectedjobs:brr}});
    res.redirect(`/candidate/rejectedjobs/${candidateid}`)
})

app.get('/candidate/logout',checkcandidatelogin,(req,res)=>
{
    delete req.session.candidate;
    res.redirect('/candidate/login');
})
//------------------------------------------------------//



app.listen(3000,()=>
{
    console.log("Listening on port 3000");
})