const mongoose=require('mongoose');
const bcrypt=require('bcrypt');

const employeeSchema=new mongoose.Schema({
    email:
    {
        type:String
    },
    password:
    {
        type:String
    },
    employeename:
    {
        type:String
    }
})

employeeSchema.pre("save",async function(next)
{
    const salt = await bcrypt.genSalt(6);
    const hashed = await bcrypt.hash(this.password, salt);
    this.password=hashed;
    next();
})

Employee=mongoose.model('Employee',employeeSchema)

module.exports={Employee};