const nodemailer = require("nodemailer");

const SendMail = args => {
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  });
  // setup email data
  let mailOptions = {
    from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_USERNAME}>`,
    to: args.to,
    subject: args.subject,
    html: args.body,
  };

  // send mail with defined transport object
  return transporter.sendMail(mailOptions);
};

export default SendMail;
