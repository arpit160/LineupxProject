const mongoose=require('mongoose')
function connectDb()
{
    mongoose.connect('mongodb+srv://ArpitSinghal:Arpit@123@cluster0.gxqem.mongodb.net/db2021?retryWrites=true&w=majority'
    , {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>
    {
    console.log('database connected')
    })
    .catch((e)=>{console.log(e)});
}

module.exports = {connectDb};