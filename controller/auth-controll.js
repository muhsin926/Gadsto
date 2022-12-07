const nodemailer = require("nodemailer");
const userModel = require("../model/signupModel");
const bcrypt = require("bcrypt");

var email;
let newUser;

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
  // User Signup
  signup: (req, res) => {
    res.render("user/signup", { unique: req.session.uniqueErr });
  },

  // DO SIGNUP
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
        newUser = new userModel({
          name,
          email,
          password: hashpass,
        });
      } else {
        res.redirect("/signup");
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
        res.render("user/otp", { msg: "", email });
      });
    } catch (err) {
      console.log(err);
      res.json("Something Error, Please try again");
    }
  },

  // OTP Veryfication
  veryfy: async (req, res) => {
    if (req.body.otp == otp) {
      try {
        await newUser.save();
        req.session.login = true;
      } catch (error) {
        res.redirect("/signup");
      }
      res.redirect("/");
    } else {
      res.render("user/otp", { msg: "OTP is incorrect" });
    }
  },

  // Rsend OTP
  resendOTP: (req, res) => {
    const email = req.query.email;
    var mailOptions = {
      to: email,
      subject: "Otp for registration is: ",
      html:
        "<h3>OTP for account verification is </h3>" +
        "<h1 style='font-weight:bold;'>" +
        otp +
        "</h1>",
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

  //LOGIN PAGE
  login: (req, res) => {
    if (req.session.login) {
      res.redirect("/");
    } else {
      res.render("user/login", {
        email: req.session.emailErr,
        pass: req.session.passErr,
      });
    }
  },

  // DO LOGIN
  dologin: async (req, res) => {
    try {
      const { email, password } = req.body;
      req.session.emailErr = false;
      req.session.passErr = false;
      const user = await userModel.findOne({
        $and: [{ email: email }, { type: "User" }],
      });
      if (!user) {
        req.session.emailErr = true;
        res.redirect("/login");
      } else {
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          req.session.login = true;
          req.session.userId = user._id;
          req.session.userName = user.name;
          res.redirect("/");
        } else {
          req.session.passErr = true;
          res.redirect("/login");
        }
      }
    } catch {
      res.json("Something wrong, please try again");
    }
  },
};
