const {
    validateDate,
    validateEmail,
    validateName,
    validateEntry,
} = require("./validate.js");

const {deleteData, getData} = require('./data.js')

module.exports = {
    validate: {
        date: validateDate,
        email: validateEmail,
        name: validateName,
        entry: validateEntry
    },
    dataHandler: {
        delete: deleteData, 
        get: getData
    }
}