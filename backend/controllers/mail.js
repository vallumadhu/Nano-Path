const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_ADDRESS,
    pass: process.env.GMAIL_APP_PASS,
  },
});

const sendMail = async (to, sub, msg) => {
  try {
    await transporter.sendMail({
      from: process.env.GMAIL_ADDRESS,
      to,
      subject: sub,
      html: msg,
    });
    console.log("Email sent");
  } catch (err) {
    console.error("Email error:", err);
  }
};

module.exports = sendMail;