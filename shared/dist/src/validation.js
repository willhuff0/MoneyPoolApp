import * as EmailValidator from 'email-validator';
const displayNameMinLength = 2;
const displayNameMaxLength = 64;
const userNameMinLength = 2;
const userNameMaxLength = 24;
const passwordMinLength = 8;
const passwordMaxLength = 64;
export const validateDisplayName = (displayName) => {
    return displayName.length >= displayNameMinLength && displayName.length <= displayNameMaxLength;
};
export const validateUserName = (userName) => {
    return userName.length >= userNameMinLength && userName.length <= userNameMaxLength;
};
export const validateEmail = (email) => {
    return EmailValidator.validate(email);
};
export const validatePassword = (password) => {
    return password.length >= passwordMinLength && password.length <= passwordMaxLength;
};
