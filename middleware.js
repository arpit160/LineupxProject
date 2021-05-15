function checkemployeelogin(req,res,next)
{
 if(req.session.employee)
 {
     next();
 }
 else
 {
     res.redirect("/employee/login")
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
     res.redirect("/candidate/login")
 }
}

module.exports={checkcandidatelogin,checkemployeelogin}