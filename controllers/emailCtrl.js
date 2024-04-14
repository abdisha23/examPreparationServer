const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");

const sendEmail = asyncHandler( async(data, req, res) => {
    let transporter = nodemailer.createTransport({
        service: "Gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.user,
            pass: process.env.password,
        },
});

const info = await transporter.sendMail({
    from: process.env.user,
    to: data.to,
    subject: data.subject,
    text: data.text,
    html: data.htm
});
console.log("Message sent: %s", info.messageId);
console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
});
module.exports = sendEmail;