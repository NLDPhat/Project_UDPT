var nodemailer = require("nodemailer");

var smtpTransport = nodemailer.createTransport("SMTP",{
   service: "smtp.gmail.com",
   port: 587,
   auth: {
       user: '',
       pass: '',
   }
});

var mailOptions={
    from:"phatduynguyen@gmail.com",
    to: "anh.anh.duy.nguyen@gmail.com",
    subject:"Demo",
    text:"Hello",
    html:"<b>Hello</b>"
}

smtpTransport.sendMail(mailOptions,function (err,response) {
    if(error){
        console.log(error);
    }else{
        console.log("Message sent: " + response.message);
    }
});