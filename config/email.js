const nodemailer = require('nodemailer')

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_SENDER_ADDRESS,
      pass: process.env.EMAIL_SENDER_PASSWORD
    }
});

const EmailSenderService = {
    sendEmail: function(to, subject, text, callback) {
      let mailOptions = {
        from: process.env.EMAIL_SENDER_ADDRESS,
        to: to,
        subject: subject,
        text: text
      };
      transporter.sendMail(mailOptions, callback);
    }
  };
  
  module.exports = EmailSenderService;
  
