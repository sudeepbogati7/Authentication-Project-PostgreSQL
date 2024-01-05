"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../models/User");
const express = __importStar(require("express"));
const sequelize_1 = require("sequelize");
const passport = __importStar(require("passport"));
const router = express.Router();
// route for registration 
router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password } = req.body;
        //checking if the username or email already exists
        const existingUser = yield User_1.User.findOne({
            where: {
                [sequelize_1.Op.or]: [{ username }, { email }],
            },
        });
        if (existingUser)
            return res.status(400).json({ error: "Username or email already exists" });
        //creating a new user
        const newUser = yield User_1.User.create({
            username,
            email,
            password,
        });
        res.status(201).json({ success: true, user: newUser, message: "Sucessfully registered a new user " });
    }
    catch (error) {
        console.log("Internal server error : ", error);
        res.status(500).json({ error: "Internal server error : ", });
    }
}));
// login route 
router.post("/login", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    passport.authenticate('local', (err, user, info) => {
        if (err)
            return res.status(500).json({ error: "Internal server error" });
        if (!user)
            return res.status(401).json({ error: " Invalid email or password " });
        req.logIn(user, (loginErr) => {
            if (loginErr)
                return res.status(500).json({ error: "Internal server error " });
            return res.status(200).json({ message: "Login Successfull ", user });
        });
    })(req, res, next);
}));
// view user profile
router.get("/profile", (req, res) => {
    // check if the user is authenticated 
    if (req.isAuthenticated()) {
        return res.status(200).json({ user: req.user });
    }
    else {
        return res.status(401).json({ error: "Unauthorized " });
    }
});
//logout
router.post("/logout", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.isAuthenticated()) {
        req.logout((err) => {
            res.status(500).json("Error while logging out ");
            return res.status(200).json({ message: "Logout Successful " });
        });
    }
    else {
        return res.status(401).json({ error: "Unauthorized " });
    }
}));
//update user profile
router.put("/update", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.isAuthenticated()) {
            const { username, email, password } = req.body;
            // retrive the authenticated user 
            const authenticatedUser = req.user;
            //update user details 
            if (username) {
                authenticatedUser.username = username;
            }
            if (email) {
                authenticatedUser.email = email;
            }
            if (password) {
                authenticatedUser.password = password;
            }
            yield authenticatedUser.save();
            return res.status(200).json({ success: true, user: authenticatedUser, message: "Successfully update user detail(s) " });
        }
        else {
            return res.status(401).json({ error: "Unauthorized !" });
        }
    }
    catch (error) {
        console.log("Internal Server Error : ", error);
        return res.status(500).json({ error: "Internal server error " });
    }
}));
//delete user 
router.delete("/delete", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.isAuthenticated()) {
            const authenticatedUser = req.user;
            //delete user accoutn
            yield authenticatedUser.destroy();
            req.logout((err) => {
                if (err)
                    return res.status(500).json("Error while logging out ");
                return res.status(200).json({ message: "Account deleted successfully " });
            });
        }
        else {
            return res.status(401).json({ error: "Unauthorized " });
        }
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error " });
    }
}));
exports.default = router;
