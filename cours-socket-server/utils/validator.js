const Yup = require('yup')

let login = Yup.object({
    username: Yup.string().required().email().min(1).max(155),
    password: Yup.string().required().min(1).max(255)
});

let userCreation = Yup.object({
    username: Yup.string().required().email().min(1).max(155),
    password: Yup.string().required().min(6).max(255)
});

let messageCreation = Yup.object({
    message: Yup.string().required().min(1).max(255),
    senderID: Yup.number().required().min(1).max(10),
    // receiverID: Yup.number().nullable().transform((value, originalValue) => {
    //     return originalValue === "" ? null : value;
    // }).min(0).max(10)
});

module.exports = {
    login,
    userCreation,
    messageCreation
}