"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var nodemailer = require("nodemailer");

var SendMail = function SendMail(args, cb) {
    var transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_SECURE,
        auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD
        }
    });
    // setup email data with unicode symbols
    var mailOptions = {
        from: "\"" + process.env.SMTP_FROM_NAME + "\" <" + process.env.SMTP_USERNAME + ">", // sender address
        to: args.to, // list of receivers
        subject: args.subject, // Subject line
        html: args.body // html body
    };

    // send mail with defined transport object
    return transporter.sendMail(mailOptions);
};

exports.default = SendMail;