"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

(function () {
    var enterModule = require('react-hot-loader').enterModule;

    enterModule && enterModule(module);
})();

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

var _default = SendMail;
exports.default = _default;
;

(function () {
    var reactHotLoader = require('react-hot-loader').default;

    var leaveModule = require('react-hot-loader').leaveModule;

    if (!reactHotLoader) {
        return;
    }

    reactHotLoader.register(SendMail, "SendMail", "api/utils/mail.js");
    reactHotLoader.register(_default, "default", "api/utils/mail.js");
    leaveModule(module);
})();

;