import * as EmailValidator from 'email-validator';

const displayNamePattern = /^\S.{0,62}\S$/;
const userNamePattern = /^[0-9A-Za-z]{6,16}$/;
const passwordPattern = /^.{8,32}$/;

const poolNamePattern = /^\S.{0,62}\S$/;

const transactionDescriptionPattern = /^\S.{0,126}\S$/;

export const validateDisplayName = (displayName: string): boolean => {
    if (typeof displayName !== "string") return false;
    return displayNamePattern.test(displayName);
}

export const validateUserName = (userName: string): boolean => {
    if (typeof userName !== "string") return false;
    return userNamePattern.test(userName);
}

export const validateEmail = (email: string): boolean => {
    if (typeof email !== "string") return false;
    return EmailValidator.validate(email);
}

export const validatePassword = (password: string): boolean => {
    if (typeof password !== "string") return false;
    return passwordPattern.test(password);
}

export const validatePoolName = (name: string): boolean => {
    if (typeof name !== "string") return false;
    return poolNamePattern.test(name);
}

export const validateTransactionDescription = (description: string): boolean => {
    if (typeof description !== "string") return false;
    return transactionDescriptionPattern.test(description);
}