const express = require("express")
const { userRouter } = require("./routes/user.route")
const bcrypt = require("bcrypt")
const userModel = require("./models/user.model")
const { connection } = require("./db")
const cors = require('cors')
const cityRoutes = require('./routes/city.route'); // Import city routes
const stateRoute = require('./routes/state.route')
const warehouseRoute = require('./routes/warehouse.route')
const { authenticate } = require("./middleware/middleware")
const nodemailer = require("nodemailer"); // Import Nodemailer
require('dotenv').config()

const app = express()
app.use(cors({ origin: "*" }));
app.use(express.json())


app.get("/", (req, res) => {
    res.send("DigitalFlake hone route")
})

app.use("/user", userRouter)
app.use(authenticate);
app.use("/state", stateRoute)
app.use("/city", cityRoutes)
app.use("/warehouse", warehouseRoute)

// Nodemailer configuration
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "sutarimran47@gmail.com", // Your Gmail address
      pass: process.env.PASS ,    // App-specific password from Google
    },
  });
  
  // Send mail route
  app.post("/send-mail", (req, res) => {
    const { email } = req.body; // Extract email from the request body
  
    // Reset link - can include a token for security purposes
    const resetLink = `${process.env.LINK}${encodeURIComponent(email)}`;
  
    const mailOptions = {
      from: "sutarimran47@gmail.com", // Sender address
      to: email,                      // Receiver email address (user's email)
      subject: "Reset your password",  // Email subject
      text: `You requested a password reset. Click here to reset your password: ${resetLink}`, // Email body content with the reset link
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).send("Error sending email: " + error.message);
      } else {
        console.log("Email sent: " + info.response);
        res.send("Reset password email sent successfully!");
      }
    });
  });
  


app.listen(8080, async () => {
    try {
        await connection
        console.log("connected to db");
    } catch (error) {
        console.log("cannot connected to db");
        console.log(error);
    }
    console.log("server started at port 8050");
})
