const User = require('../model/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const random_String = require('randomstring');
const fs = require('fs');



const Create_Token = async (id) => {
    try {
        const token = await jwt.sign(id, config.secret_jwt, { expiresIn: "2h" });
        return token;
    } catch (error) {
        console.log(error.message);
    }
}

const Renew_Token = async (id) => {
    try {
        const secret_jwt = config.secret_jwt;
        const newSecret_jwt = random_String.generate();
        fs.readFile('config/config.js', 'utf-8', function (err, data) {
            if (err) throw err;
            var newValue = data.replace(new RegExp(secret_jwt, 'g'), newSecret_jwt);
            console.log(newValue);
            fs.writeFile('config/config.js', newValue, 'utf-8', function (err, data) {
                if (err) {
                    throw err
                }
                console.log("Working now ", data);
            });
            console.log("Hello", data);
        });

        const token = await jwt.sign({ _id: id }, newSecret_jwt, { expiresIn: "24h" });

        return token;

    } catch (error) {
        console.log(error.message);
    }
}

const securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;
    } catch (error) {
        console.log(error.message);
    }
}

const registation = async (req, res) => {
    try {
        const reqBody = req.body;
        const { name, email, password, mobile } = reqBody;
        if (!email || !password || !name || !mobile) {
            res.status(400).send({ success: false, msg: "Please fill all the fields" });
        }
        const userData = await User.findOne({ email: email });
        const newPassword = await securePassword(password);
        if (userData) {
            res.status(400).send({ success: false, msg: "User Already Exist" });
        } else {
            const userData = await User.create({
                name: name,
                email: email,
                password: newPassword,
                mobile: mobile,
            });
            
            res.status(200).send({ success: true, msg: "Registation Completed Successfully!", Data: userData });
        }
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
}

const userLogin = async (req, res) => {
    try {
        const reqBody = req.body;
        const { email, password } = reqBody;
        if (!email || !password) {
            res.status(400).send({ success: false, msg: "Please fill all the fields" });
        }
        const userData = await User.findOne({ email: email });
        if (userData) {
            const passwordMatch = await bcrypt.compare(password, userData.password);
            if (passwordMatch) {
                const token = await Create_Token({ id: userData._id });
                await User.updateOne({ email: email }, { token: token });
                const updatedUser = await User.findOne({ email: email });
                const response = {
                    success: true,
                    message: "User Details",
                    data: updatedUser
                }
                res.status(200).send(response);
            } else {
                res.status(400).send({ success: false, msg: "Email Or Password Wrong!" });
            }
        } else {
            res.status(400).send({ success: false, msg: "Email Or Password Wrong!" });
        }

    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
}

const refressToken = async (req, res) => {
    try {
        const reqBody = req.body;
        const { user_id } = reqBody;
        const userData = await User.findOne({ _id: user_id });
        if (userData) {
            const tokenData = await Renew_Token(user_id);
            await User.updateOne({ _id: user_id }, { token: tokenData });
            const updatedUser = { user_id, tokenData }
            const response = {
                success: true,
                message: "The Token has Refress Successfuly!",
                data: updatedUser
            }
            res.status(200).send(response);
        } else {
            res.status(400).send({ success: false, msg: "This User_id Does not exists" });
        }

    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
}

const userLogout = async (req, res) => {
    try {
        const reqBody = req.body;
        const { user_id } = reqBody;
        const userData = await User.findOne({ _id: user_id });
        if (userData) {
            userData.token = '';
            req.session.destroy();
            res.status(200).send({ success: true, msg: "User Logout Successfully!" });
        } else {
            res.status(400).send({ success: false, msg: "User_Id Does not exists!" });
        }

    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }

}

module.exports = {
    registation,
    userLogin,
    refressToken,
    userLogout
}