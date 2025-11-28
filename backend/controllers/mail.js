const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_ADDRESS,
    pass: process.env.GMAIL_APP_PASS,
  },
});

const sendMail = async (to, sub, msg) => {
  try {
    const result = await transporter.sendMail({
      from: `"NanoPath" <${process.env.GMAIL_ADDRESS}>`,
      to,
      subject: sub,
      html: msg,
    });
    console.log("Mail sent:", result);
  } catch (err) {
    console.error("Mail error:", err);
  }
};

module.exports = sendMail;