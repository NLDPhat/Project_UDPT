var nodemailer = require("nodemailer");

var smtpTransport = nodemailer.createTransport("SMTP",{
   service: "Gmail",
   auth: {
       user: "phatduynguyen@gmail.com",
       pass: "p12201995"
   }
});