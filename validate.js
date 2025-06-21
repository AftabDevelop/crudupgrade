const validator = require('validator');

function validateuser(data) {
  const mandatory = ["name", "age", "email","password"];
  const isAllPresent = mandatory.every(field => data.hasOwnProperty(field));
  if (!isAllPresent) {
    throw new Error("Field is missing");
  }

  // Email verification
  if (!validator.isEmail(data.email)) {
    throw new Error("Email is not correct");
  }

  // Name length check (must be more than 3 and less than or equal to 30)
  if (data.name.length <= 3 || data.name.length > 30) {
    throw new Error("Name must be more than 3 and less than or equal to 30 characters");
  }

  if(!validator.isStrongPassword(data.password)){
    throw new Error("Password is not strong");
  }
}

module.exports = validateuser;