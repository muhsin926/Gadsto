const nodemailer = require("nodemailer");
const userModel = require("../model/signupModel");
const bcrypt = require("bcrypt");

var email;

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  service: "Gmail",

  auth: {
    user: "gadstoonlineshop@gmail.com",
    pass: "crlqlcnwlfizjudc",
  },
});

var otp = Math.random();
otp = otp * 1000000;
otp = parseInt(otp);
console.log(otp);

module.exports = {
  dosignup: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      if (!req.session.login) {
        const user = await userModel.findOne({ email });
        req.session.uniqueErr = false;
        if (user) {
          req.session.uniqueErr = true;
          return res.redirect("/signup");
        }
        const hashpass = await bcrypt.hash(password, 10);
        const newUser = new userModel({
          name,
          email,
          password: hashpass,
        });
        try {
          await newUser.save();
          req.session.login = true;
        } catch (error) {
          res.redirect("/signup");
        }
      } else {
        res.redirect("/");
      }

      var mailOptions = {
        to: email,
        subject: "Otp for registration is: ",
        html:
          "<h3>OTP for account verification is </h3>" +
          "<h1 style='font-weight:bold;'>" +
          otp +
          "</h1>", // html body
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

        res.render("user/otp", { msg: "OTP send", email });
      });
    } catch (err) {
      console.log(err);
      res.json("Something Error, Please try again");
    }
},


  // OTP Veryfication
  veryfy: (req, res) => {
    console.log("verify");
    if (req.body.otp == otp) {
      res.redirect("/");
    } else {
      res.render("otp", { msg: "OTP is incorrect" });
    }
  },

  // Rsend OTP
  resendOTP: (req, res) => {
    var mailOptions = {
      to: email,
      subject: "Otp for registration is: ",
      html:
        "<h3>OTP for account verification is </h3>" +
        "<h1 style='font-weight:bold;'>" +
        otp +
        "</h1>", // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      res.render("user/otp", { msg: "otp has been sent" });
    });
  },
};
