require("dotenv").config();
var nodemailer = require("nodemailer");
const express = require("express");
const cors = require('cors')

const transporter = nodemailer.createTransport({
  host: "mail.brakwatercatalogue.info",
  port: 465,
  secure: true, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const app = express();
app.use(express.json())
app.use(cors())

const port = 8080;

app.post("/", async (req, res) => {
  const { email, subject, message } = req.body;

  try {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: `"Order System" <${process.env.SMTP_USER}>`, // sender address
      to: email, // list of receivers
      subject, // Subject line
      text: message, // plain text body
      html: message, // html body
    });

    console.log("Message sent: %s", info.messageId);
    res.send({ success: true });
  } catch (e) {
    console.error(e);
    res.send({ success: false, message: e.message });
  }
});

app.listen(port, () => {
  console.log(`Email service listening on port ${port}`);
});
