const validator = require("validator");

const cleanUpAndValidate = ({ email, password, name, username }) => {
  return new Promise((resolve, reject) => {
    if (!email || !password || !name || !username)
      reject("all fields are required");

    if (typeof email !== "string") reject("Email type is incorrect.");
    if (typeof password !== "string") reject("Password type is incorrect.");
    if (typeof name !== "string") reject("Name type is incorrect.");
    if (typeof username !== "string") reject("Username type is incorrect.");

    if (username.length <= 2 || username.length > 30)
      reject("Username should be of 3-30 chars");
    if (password.length <= 2 || password.length > 30)
      reject("Password should be of 3-30 chars");

    if (!validator.isEmail(email)) reject("Format of email is wrong");

    resolve();
  });
};
module.exports = { cleanUpAndValidate };
