const {Employee}=require('../models/employer');
const mongoose=require('mongoose');

mongoose.connect('mongodb+srv://ArpitSinghal:Arpit@123@cluster0.gxqem.mongodb.net/db2021?retryWrites=true&w=majority'
, {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>
{
console.log('database connected')
})
.catch((e)=>{console.log(e)});

const arr=[
    {
        employeename:"emp1",
        email:"emp1@gmail.com",
        password:"abc"
    },
    {
        employeename:"emp4",
        email:"emp4@gmail.com",
        password:"abc"
    },
    {
        employeename:"emp2",
        email:"emp2@gmail.com",
        password:"abc"
    },
    {
        employeename:"emp3",
        email:"emp3@gmail.com",
        password:"abc"
    },
   

];

async function create()
{
    await Employee.deleteMany({});
    for(let i=0;i<arr.length;i++)
    {
        let x=new Employee(arr[i]);
        await x.save();
    }
}

create();
