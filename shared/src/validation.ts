import * as EmailValidator from 'email-validator';

const displayNamePattern = new RegExp("/^\S.{0,62}\S$/");
const userNamePattern = new RegExp("/^[0-9A-Za-z]{6,16}$/");
const passwordPattern = new RegExp("/^.{8,32}$/");

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
