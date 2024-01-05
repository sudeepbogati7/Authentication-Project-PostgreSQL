"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var User_1 = require("../models/User");
var express = require("express");
var sequelize_1 = require("sequelize");
var passport = require("passport");
var router = express.Router();
// route for registration 
router.post("/register", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, email, password, existingUser, newUser, error_1;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 3, , 4]);
                _a = req.body, username = _a.username, email = _a.email, password = _a.password;
                return [4 /*yield*/, User_1.User.findOne({
                        where: (_b = {},
                            _b[sequelize_1.Op.or] = [{ username: username }, { email: email }],
                            _b),
                    })];
            case 1:
                existingUser = _c.sent();
                if (existingUser)
                    return [2 /*return*/, res.status(400).json({ error: "Username or email already exists" })];
                return [4 /*yield*/, User_1.User.create({
                        username: username,
                        email: email,
                        password: password,
                    })];
            case 2:
                newUser = _c.sent();
                res.status(201).json({ success: true, user: newUser, message: "Sucessfully registered a new user " });
                return [3 /*break*/, 4];
            case 3:
                error_1 = _c.sent();
                console.log("Internal server error : ", error_1);
                res.status(500).json({ error: "Internal server error : ", });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// login route 
router.post("/login", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        passport.authenticate('local', function (err, user, info) {
            if (err)
                return res.status(500).json({ error: "Internal server error" });
            if (!user)
                return res.status(401).json({ error: " Invalid email or password " });
            req.logIn(user, function (loginErr) {
                if (loginErr)
                    return res.status(500).json({ error: "Internal server error " });
                return res.status(200).json({ message: "Login Successfull ", user: user });
            });
        })(req, res, next);
        return [2 /*return*/];
    });
}); });
// view user profile
router.get("/profile", function (req, res) {
    // check if the user is authenticated 
    if (req.isAuthenticated()) {
        return res.status(200).json({ user: req.user });
    }
    else {
        return res.status(401).json({ error: "Unauthorized " });
    }
});
//logout
router.post("/logout", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        if (req.isAuthenticated()) {
            req.logout();
            return [2 /*return*/, res.status(200).json({ message: "Logout Successful " })];
        }
        else {
            return [2 /*return*/, res.status(401).json({ error: "Unauthorized " })];
        }
        return [2 /*return*/];
    });
}); });
//update user profile
router.put("/update", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, email, password, authenticatedUser, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                if (!req.isAuthenticated()) return [3 /*break*/, 2];
                _a = req.body, username = _a.username, email = _a.email, password = _a.password;
                authenticatedUser = req.user;
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
                return [4 /*yield*/, authenticatedUser.save()];
            case 1:
                _b.sent();
                return [2 /*return*/, res.status(200).json({ success: true, user: authenticatedUser, message: "Successfully update user detail(s) " })];
            case 2: return [2 /*return*/, res.status(401).json({ error: "Unauthorized !" })];
            case 3: return [3 /*break*/, 5];
            case 4:
                error_2 = _b.sent();
                console.log("Internal Server Error : ", error_2);
                return [2 /*return*/, res.status(500).json({ error: "Internal server error " })];
            case 5: return [2 /*return*/];
        }
    });
}); });
//delete user 
router.delete("/delete", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var authenticatedUser, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                if (!req.isAuthenticated()) return [3 /*break*/, 2];
                authenticatedUser = req.user;
                //delete user accoutn
                return [4 /*yield*/, authenticatedUser.destroy()];
            case 1:
                //delete user accoutn
                _a.sent();
                req.logout(function (err) {
                    if (err)
                        return res.status(500).json("Error while logging out ");
                    return res.status(200).json({ message: "Account deleted successfully " });
                });
                return [3 /*break*/, 3];
            case 2: return [2 /*return*/, res.status(401).json({ error: "Unauthorized " })];
            case 3: return [3 /*break*/, 5];
            case 4:
                error_3 = _a.sent();
                res.status(500).json({ error: "Internal server error " });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
