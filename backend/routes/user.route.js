const express = require("express")
const jwt = require("jsonwebtoken")
const userModel = require("../models/user.model")
const fs = require("fs")
const bcrypt = require("bcrypt")
const userRouter = express.Router()
const path = require('path'); // Optional, for cleaner file path handling

userRouter.post("/signup", async (req, res) => {
    const { email, password, resetPassword } = req.body
    try {
        if (password !== resetPassword) {
            res.send("Password does not matched")
            return
        }
        else {
            bcrypt.hash(password, 5, async (err, hash) => {
                if (err) {
                    res.status(500).send({ "message": err.message })
                } else {
                    const user = new userModel({ email, password: hash })
                    await user.save()
                    console.log("new user created", user);
                    res.send({ "msg": "User Registered success" })
                }
            });
        }
    }
    catch (error) {
        res.send({ "msg": error.message })
    }
})

userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.find({ email });
        if (user.length > 0) {
            console.log('User found, attempting login');
            bcrypt.compare(password, user[0].password, (err, result) => {
                if (err) {
                    return res.send({ msg: "Internal server error" });
                }
                if (result) {
                    let val = user[0]._id.toString();
                    fs.writeFile('userId.txt', val, (err) => {
                        if (err) {
                            console.error('Error writing to file', err);
                        }
                    });
                    var token = jwt.sign({ data: user[0].email }, "imran");
                    fs.writeFile('token.txt', token, (err) => {
                        if (err) {
                            console.error('Error writing to file', err);
                        }
                    });
                    return res.send({ token: token });
                } else {
                    return res.send({ msg: "Invalid password" });
                }
            });
        } else {
            console.log('User not found');
            return res.send({ msg: "User not found" });
        }
    } catch (error) {
        return res.send({ msg: error.message });
    }
});

userRouter.post("/logout", async (req, res) => {
    fs.unlink('token.txt', (err) => {
        if (err) {
            console.error('Error deleting token file:', err);
            return res.status(500).send({ msg: "Error during logout. Could not delete token." });
        }
        return res.send({ msg: "Logout successful. Token deleted." });
    });
});

userRouter.post("/checkEmail", async (req, res) => {
    const { email } = req.body; // Extract the email from the request body
    try {
        // Check if the user exists in the database
        const user = await userModel.findOne({ email });

        if (user) {
            res.status(200).send({ msg: "User exists", userExists: true });
        } else {
            res.status(404).send({ msg: "User does not exist", userExists: false });
        }
    } catch (error) {
        res.status(500).send({ msg: "Server error", error: error.message });
    }
});

userRouter.post("/update-password", async (req, res) => {
    const { email, currentPassword, newPassword } = req.body;

    try {
        // Step 1: Find the user by email
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).send({ msg: "User not found" });
        }
        console.log(user)
        bcrypt.hash(newPassword, 5, async (err, hash) => {
            if (err) {
                res.status(500).send({ "message": err.message })
            } else {
                user.password = hash;
                await user.save();
                console.log("Password updated successfully");
                res.send("Password updated success")
            }
        });
    } catch (error) {
        console.error("Error updating password:", error);
        res.status(500).send({ msg: "Internal server error" });
    }
});

module.exports = {
    userRouter
}
