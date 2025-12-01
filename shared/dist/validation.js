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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTransactionDescription = exports.validatePoolName = exports.validatePassword = exports.validateEmail = exports.validateUserName = exports.validateDisplayName = void 0;
const EmailValidator = __importStar(require("email-validator"));
const displayNamePattern = /^\S.{0,62}\S$/;
const userNamePattern = /^[0-9A-Za-z]{6,16}$/;
const passwordPattern = /^.{8,32}$/;
const poolNamePattern = /^\S.{0,62}\S$/;
const transactionDescriptionPattern = /^\S.{0,126}\S$/;
const validateDisplayName = (displayName) => {
    if (typeof displayName !== "string")
        return false;
    return displayNamePattern.test(displayName);
};
exports.validateDisplayName = validateDisplayName;
const validateUserName = (userName) => {
    if (typeof userName !== "string")
        return false;
    return userNamePattern.test(userName);
};
exports.validateUserName = validateUserName;
const validateEmail = (email) => {
    if (typeof email !== "string")
        return false;
    return EmailValidator.validate(email);
};
exports.validateEmail = validateEmail;
const validatePassword = (password) => {
    if (typeof password !== "string")
        return false;
    return passwordPattern.test(password);
};
exports.validatePassword = validatePassword;
const validatePoolName = (name) => {
    if (typeof name !== "string")
        return false;
    return poolNamePattern.test(name);
};
exports.validatePoolName = validatePoolName;
const validateTransactionDescription = (description) => {
    if (typeof description !== "string")
        return false;
    return transactionDescriptionPattern.test(description);
};
exports.validateTransactionDescription = validateTransactionDescription;
