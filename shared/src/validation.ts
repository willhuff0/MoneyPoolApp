import * as EmailValidator from 'email-validator';

const displayNameMinLength = 2;
const displayNameMaxLength = 64;

const passwordMinLength = 8;
const passwordMaxLength = 64;

export const validateDisplayName = (displayName: string): boolean => {
    return displayName.length >= displayNameMinLength && displayName.length <= displayNameMaxLength;
}

export const validateEmail = (email: string): boolean => {
    return EmailValidator.validate(email);
}

export const validatePassword = (password: string): boolean => {
    return password.length >= passwordMinLength && password.length <= passwordMaxLength;
}
