const evalidator = require("email-validator"),
    moment = require("moment")


function validateDate(dateArg, format) {
    const parsedDate = moment(dateArg, format, true);
    return parsedDate.isValid();
}

function validateEmail(arg) {
    return evalidator.validate(arg);
}

function validateName(arg) {
    return typeof arg === "string" && /^[a-zA-Z]+$/.test(arg);
}

function validateEntry(arg) {
    const keys = ["date", "name", "surname", "mail"];
    if (Object.keys(arg).every((el) => keys.includes(el))) {
        if (
            validateDate(arg.date, "DD-MM-YYYY") &&
            validateEmail(arg.mail) &&
            validateName(arg.name) &&
            validateName(arg.surname)
        ) return true;
    }
    return false;
}

module.exports = {
    validateDate, 
    validateEmail,
    validateName,
    validateEntry,
}