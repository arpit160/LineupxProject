function checkemployeelogin(req,res,next)
{
 if(req.session.employee)
 {
     next();
 }
 else
 {
     res.send("Please Login first")
 }
}

function checkcandidatelogin(req,res,next)
{
 if(req.session.candidate)
 {
     next();
 }
 else
 {
     res.send("Please Login first")
 }
}

module.exports={checkcandidatelogin,checkemployeelogin}