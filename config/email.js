const nodemailer = require('nodemailer');

const GmailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_SENDER_ADDRESS,
    pass: process.env.EMAIL_SENDER_PASSWORD
  }
});

const OutlookTransporter = nodemailer.createTransport({
  service: 'hotmail',
  auth: {
    user: process.env.EMAIL_SENDER_ADDRESS,
    pass: process.env.EMAIL_SENDER_PASSWORD
  }
});

const EmailSenderService = {
  sendEmail: function (to, subject, text, html) {
    let transporter = GmailTransporter;
    if (to.endsWith('@hotmail.com') || to.endsWith('@outlook.com')) {
      transporter = OutlookTransporter;
    }
    let mailOptions = {
      from: process.env.EMAIL_SENDER_ADDRESS,
      to: to,
      subject: subject,
      text: text,
      html: html,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error("[Config: EmailSenderService]: Send email error:", error)
        return;
      }
      console.log("[Config: EmailSenderService]: Send email successful", info.envelope.to)
    });
  }
};

module.exports = EmailSenderService;
