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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
// import { Strategy as GoogleStrategy } from 'passport-google-oauth';
const User_1 = require("../models/User");
const bcrypt_1 = __importDefault(require("bcrypt"));
// serialize 
passport_1.default.serializeUser((User, done) => {
    done(null, User.userId);
});
passport_1.default.deserializeUser((serializeUser, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.User.findByPk(serializeUser.userId);
        if (!user)
            return done(null, false, { message: "User not found !" });
        done(null, user);
    }
    catch (error) {
        done(error);
    }
}));
//local strategy for username and password authentication 
passport_1.default.use(new passport_local_1.Strategy({ usernameField: 'email' }, (username, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.User.findOne({ where: { email } });
        if (!user)
            return done(null, false, { message: "Incorrect email " });
        const passwordMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!passwordMatch)
            return done(null, false, { message: "Incorrect password ! " });
        return done(null, user);
    }
    catch (error) {
        return done(error);
    }
})));
exports.default = passport_1.default;
